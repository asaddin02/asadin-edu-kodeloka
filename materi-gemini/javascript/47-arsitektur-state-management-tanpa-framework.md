# Arsitektur State Management & Komponen Reaktif Tanpa Framework (Vanilla JS)

- **Tingkat:** Lanjut
- **Ringkasan:** Merancang arsitektur aplikasi sisi klien yang terukur menggunakan aliran data satu arah (*Unidirectional Data Flow*: `State -> View -> Action`), pola *Store* terpusat yang mudah diuji, *Signal/Observable* ringan, serta pembaruan DOM yang terfokus.

## Mengapa Aplikasi Vanilla JS Sering Menjadi Spageti Saat Tumbuh Besar?

Pada halaman kecil, membaca status langsung dari DOM (`const aktif = tombol.classList.contains("aktif")`) lalu mengubah elemen lain di dalam *event listener* terasa mudah. Namun ketika aplikasi memiliki filter pencarian, daftar modul yang selesai, lencana penghitung di header, dan penyimpanan `localStorage` yang saling bergantung, menjadikan DOM sebagai sumber data membuat alur perubahan mustahil dilacak.

Solusi arsitekturnya adalah memisahkan **Sumber Kebenaran Tunggal (*Single Source of Truth*)** di dalam memori JavaScript menggunakan pola **Aliran Data Satu Arah (*Unidirectional Data Flow*)**:
1. **State** menyimpan seluruh data aplikasi dalam bentuk objek tak-berubah (*immutable*).
2. **View** merender tampilan DOM semata-mata sebagai fungsi dari `State`.
3. Interaksi pengguna tidak langsung mengutak-atik DOM di tempat lain, melainkan mengirimkan **Action** ke fungsi murni **Reducer** untuk menghasilkan `State` baru!

> **⚠️ Jebakan Umum di Lapangan:** Menyimpan kebenaran data (*state*) secara tersebar di dalam atribut DOM atau variabel global yang dimodifikasi dari puluhan *event listener* berbeda membuat alur aplikasi mustahil dilacak saat terjadi bug.

## 1. Perbandingan Tiga Pola Pengelolaan State di Vanilla JavaScript

Anda dapat memilih pola pengelolaan state sesuai kompleksitas antarmuka yang sedang dibangun:

| Pola Arsitektur | Mekanisme Utama | Keunggulan & Kasus Penggunaan |
| :--- | :--- | :--- |
| **Store + Reducer** (Gaya Redux/Elm) | `stateBaru = reducer(stateLama, aksi)`, lalu memanggil seluruh fungsi pendengar di `Set`. | Sangat terprediksi dan **100% dapat diuji di Node.js tanpa DOM** karena `reducer` adalah fungsi murni! |
| **Reactive Signal / Atom** | Nilai tunggal pembungkus (`buatSignal(0)`) yang melacak pendengar spesifik per nilai. | Pembaruan DOM sangat terfokus (*fine-grained*) tanpa perlu mengevaluasi ulang seluruh pohon komponen. |
| **Event-Driven Store** (`EventTarget`) | Store yang memancarkan `CustomEvent` spesifik per domain perubahan. | Cocok untuk mengintegrasikan beberapa Web Components mandiri di halaman yang sama. |

## 2. Membangun *Store* Terpusat dengan *Reducer* Murni dan Fungsi *Unsubscribe*

Perhatikan bagaimana fungsi `buatStore` di bawah ini hanya membutuhkan kurang dari 20 baris kode standar, menggunakan `Set` untuk menyimpan daftar pelanggan (*subscribers*), dan mengembalikan fungsi pembersih (*unsubscribe*) agar komponen yang dihapus tidak membocorkan memori:

```javascript
export function buatStore(reducer, stateAwal) {
  let state = stateAwal;
  const pendengar = new Set();

  return {
    ambilState: () => state,
    kirimAksi(aksi) {
      const stateBerikutnya = reducer(state, aksi);
      if (!Object.is(state, stateBerikutnya)) {
        state = stateBerikutnya;
        for (const fn of pendengar) fn(state);
      }
    },
    langganan(fn) {
      pendengar.add(fn);
      return () => pendengar.delete(fn); // Fungsi berhenti langganan (unsubscribe)
    }
  };
}

// Contoh Reducer murni (mudah diuji tanpa DOM!)
export function reducerProgresBelajar(state = { selesai: [], filter: "semua" }, aksi) {
  switch (aksi.tipe) {
    case "TANDAI_SELESAI":
      if (state.selesai.includes(aksi.idModul)) return state;
      return { ...state, selesai: [...state.selesai, aksi.idModul] };
    case "UBAH_FILTER":
      return { ...state, filter: aksi.filter };
    default:
      return state;
  }
}
```

## 3. Memperbarui DOM Secara Terfokus Tanpa Menghancurkan Fokus Papan Ketik

Kesalahan paling fatal saat merender ulang tampilan dari `store.langganan((state) => ...)` adalah menimpa `kontainer.innerHTML = ...` pada seluruh halaman setiap kali state berubah. Mengganti `innerHTML` secara kasar akan **menghancurkan elemen `<input>` yang sedang diketik pengguna**, menghilangkan posisi kursor fokus, dan menghapus *event listener* anak!

Sebaliknya, pisahkan fungsi perender per bagian kecil yang benar-benar berubah (atau bandingkan nilai sebelumnya):

```javascript
export function ikatCounterKeDom(store, selektorNilai, elemenInduk) {
  let jumlahSebelumnya = -1;
  return store.langganan((state) => {
    const jumlahSekarang = state.selesai.length;
    // Hanya sentuh DOM apabila nilai spesifik ini memang berubah!
    if (jumlahSekarang !== jumlahSebelumnya) {
      jumlahSebelumnya = jumlahSekarang;
      const el = elemenInduk.querySelector(selektorNilai);
      if (el) el.textContent = `${jumlahSekarang} modul selesai`;
    }
  });
}
```

## 4. Kesalahan Umum dan Cara Menghindarinya

1. **Memutasi `state` secara langsung di dalam fungsi `reducer` (misalnya `state.selesai.push(id); return state;`):** Jika Anda memutasi objek `state` lama lalu mengembalikan referensi objek yang sama, pemeriksaan `Object.is(state, stateBerikutnya)` akan menganggap state **tidak berubah** sehingga tampilan gagal diperbarui! Selalu kembalikan objek baru (`{ ...state, ... }`).
2. **Tidak memanggil fungsi `unsubscribe` saat komponen dinamis dihapus dari layar:** Fungsi pendengar yang tertinggal di dalam `Set` milik store akan terus dipanggil dan menahan referensi elemen DOM yang sudah terlepas (*detached DOM memory leak*).
3. **Menaruh panggilan jaringan asinkron (`fetch`) di dalam `reducer`:** Fungsi `reducer(state, aksi)` wajib 100% murni dan sinkron. Lakukan panggilan `fetch()` di fungsi aksi asinkron di luar reducer, lalu kirimkan `store.kirimAksi({ tipe: "DATA_DITERIMA", payload })` setelah respons tiba.

## Latihan Praktik Mandiri

1. Buat berkas `store-progres.mjs` yang mengekspor `buatStore` dan `reducerProgresBelajar` yang mendukung tiga aksi: `"TANDAI_SELESAI"`, `"BATALKAN_SELESAI"`, dan `"RESET_PROGRES"`.
2. Tulis pengujian unit lengkap dengan `node:test` yang menguji:
   - transisi state untuk ketiga aksi tersebut;
   - bahwa `langganan(fn)` hanya dipanggil ketika state benar-benar berubah;
   - bahwa memanggil fungsi *unsubscribe* menghentikan pemanggilan `fn` pada aksi berikutnya.

## Kuis Pemahaman

### Soal 1
Mengapa memutasi objek `state` secara langsung di dalam fungsi *reducer* (seperti `state.hitung += 1; return state;`) merupakan kesalahan serius pada arsitektur *State Management*?
- A. Karena operator `+=` tidak didukung di dalam pernyataan `switch`
- B. Karena objek `state` lama dan baru menunjuk ke alamat referensi memori yang sama (`Object.is(stateLama, stateBaru) === true`), sehingga *store* atau pemilih komponen menganggap tidak ada perubahan data dan membatalkan pembaruan tampilan
- C. Karena *reducer* hanya boleh mengembalikan tipe `string`
- D. Karena `state` disimpan di dalam cookie HTTP

**Jawaban Benar:** B
**Penjelasan:** Deteksi perubahan yang cepat pada *store* mengandalkan perbandingan referensi (`Object.is`). *Reducer* wajib bersifat murni dan selalu mengembalikan objek referensi baru ketika terjadi perubahan nilai.

### Soal 2
Pada arsitektur aliran data satu arah (*Unidirectional Data Flow*) dengan pola *Store* seperti `buatStore(reducer, stateAwal)`, bagaimana urutan alur pembaruan yang benar?
- A. Peristiwa dari pengguna memicu `kirimAksi(aksi)`; *reducer* menghitung state baru dari state lama dan aksi tersebut; seluruh pelanggan dipanggil dengan state baru lalu merender ulang tampilan.
- B. Peristiwa dari pengguna langsung mengubah elemen DOM, lalu DOM dibaca ulang sebagai sumber kebenaran state.
- C. *Reducer* mengubah objek state lama secara langsung, lalu memanggil `location.reload()` agar tampilan menyegarkan diri.
- D. Tampilan dan state saling memperbarui satu sama lain secara dua arah tanpa perantara aksi.

**Jawaban Benar:** A
**Penjelasan:** Aliran data satu arah berarti state hanya berubah lewat aksi yang diproses *reducer*, kemudian tampilan dirender ulang dari state baru. Inilah yang dilakukan `kirimAksi()` pada contoh: `state = reducer(state, aksi)` lalu setiap fungsi di `pendengar` dipanggil.

### Soal 3
Mengapa metode `store.langganan(fn)` harus mengembalikan sebuah fungsi pembersih `() => pendengar.delete(fn)` (*unsubscribe*)?
- A. Untuk menghapus seluruh isi `store` saat halaman dimuat
- B. Agar komponen antarmuka yang bersifat sementara (seperti modal atau panel yang dihapus dari DOM) dapat berhenti berlangganan sehingga tidak memicu kebocoran memori (*memory leak*) akibat referensi callback yang terus ditahan di dalam `Set` milik *store*
- C. Agar fungsi `fn` langsung dijalankan dua kali
- D. Karena `Set.prototype.add` mewajibkan pengembalian fungsi

**Jawaban Benar:** B
**Penjelasan:** Selama fungsi callback masih terdaftar di dalam `Set` pendengar milik *store* yang berumur panjang, seluruh variabel dan elemen DOM yang ditangkap oleh *closure* callback tersebut tidak dapat dibersihkan oleh *Garbage Collector* sampai dihapus lewat *unsubscribe*.

## Sumber

- [`EventTarget` — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget)
- [`Set` — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set)
