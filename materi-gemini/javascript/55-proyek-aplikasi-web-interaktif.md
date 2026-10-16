# Proyek Akhir Kelas JavaScript: Aplikasi Pelacak Belajar & Pencari Modul Interaktif

- **Tingkat:** Lanjut
- **Ringkasan:** Membangun aplikasi front-end modular yang utuh dengan menggabungkan ES Modules, Fetch API (`AbortController`), manipulasi DOM yang aman dari XSS (`<template>`, `replaceChildren`, *Event Delegation*), penyimpanan state di `localStorage` dengan sinkronisasi lintas tab, serta pengujian unit.

## Gambaran Proyek

Selamat! Anda telah menyelesaikan seluruh fondasi bahasa JavaScript modern—mulai dari sistem tipe, fungsi dan *closure*, metode array tak-mutasi ES2023+, `class` dan field privat `#`, `Map` & `Set`, penanganan galat berlapis, mekanisme *Event Loop* & `Promise`, komunikasi jaringan `fetch()`, manipulasi DOM, penyimpanan peramban, ES Modules, keamanan front-end, hingga pengujian otomatis.

Dalam proyek akhir ini, kita akan membangun **Aplikasi Pelacak Progres & Pencari Modul Kodeloka** yang mencerminkan arsitektur kode front-end produksi:
1. **Modular & Teruji (`store.js`):** Mengelola daftar modul yang sudah selesai dipelajari menggunakan `Set` dan menyimpannya secara aman ke `localStorage` (lengkap dengan sinkronisasi lintas tab!).
2. **Cepat & Responsif (`app.js`):** Menyaring modul berdasarkan kata kunci pencarian (dengan *debounce* berbasis *closure*) dan tingkat kesulitan, serta merender hasilnya menggunakan elemen `<template>` dan `replaceChildren()`.
3. **100% Aman dari DOM XSS & Efisien Memori:** Seluruh teks dimasukkan melalui `textContent`, dan seluruh klik tombol *"Tandai Selesai"* ditangani oleh **satu** *Event Listener* (*Event Delegation*).

## Struktur Berkas Proyek

### 1. Modul Penyimpanan & Logika State (`store.js`)

```js
// Berkas: ./store.js
const KUNCI_PENYIMPANAN = "kodeloka:modul-selesai:v1";

export class PenyimpanProgres {
  #selesaiSet = new Set();
  #kunci;

  constructor(kunci = KUNCI_PENYIMPANAN) {
    this.#kunci = kunci;
    this.#muatDariLokal();
  }

  #muatDariLokal() {
    try {
      const mentah = globalThis.localStorage?.getItem(this.#kunci);
      if (!mentah) return;
      const daftarId = JSON.parse(mentah);
      if (Array.isArray(daftarId)) {
        this.#selesaiSet = new Set(daftarId.map(Number));
      }
    } catch (galat) {
      console.warn("Gagal memuat progres dari localStorage:", galat);
    }
  }

  #simpanKeLokal() {
    try {
      const json = JSON.stringify([...this.#selesaiSet]);
      globalThis.localStorage?.setItem(this.#kunci, json);
    } catch (galat) {
      console.warn("Gagal menyimpan progres ke localStorage:", galat);
    }
  }

  apakahSelesai(idModul) {
    return this.#selesaiSet.has(Number(idModul));
  }

  toggleModul(idModul) {
    const id = Number(idModul);
    if (this.#selesaiSet.has(id)) {
      this.#selesaiSet.delete(id);
    } else {
      this.#selesaiSet.add(id);
    }
    this.#simpanKeLokal();
    return this.#selesaiSet.has(id);
  }

  hitungRingkasan(totalModul) {
    const selesai = this.#selesaiSet.size;
    const persen = totalModul > 0 ? Math.round((selesai / totalModul) * 100) : 0;
    return { selesai, total: totalModul, persen };
  }

  muatUlang() {
    this.#selesaiSet.clear();
    this.#muatDariLokal();
  }
}

export function saringModul(daftarModul, { kataKunci = "", tingkat = "semua" } = {}) {
  const kueri = kataKunci.trim().toLowerCase();

  return daftarModul.filter((modul) => {
    const cocokTingkat = tingkat === "semua" || modul.tingkat.toLowerCase() === tingkat.toLowerCase();
    const cocokKata =
      kueri === "" ||
      modul.judul.toLowerCase().includes(kueri) ||
      modul.tag.some((t) => t.toLowerCase().includes(kueri));

    return cocokTingkat && cocokKata;
  });
}

export function buatDebounce(fn, jedaMs = 200) {
  let timerId = null;
  return (...args) => {
    clearTimeout(timerId);
    timerId = setTimeout(() => fn(...args), jedaMs);
  };
}
```

### 2. Modul Antarmuka DOM & Event Delegation (`app.js`)

```js
// Berkas: ./app.js
import { PenyimpanProgres, saringModul, buatDebounce } from "./store.js";

const DATA_MODUL_AWAL = [
  { id: 1, judul: "Pengantar & Tipe Data", tingkat: "Dasar", durasi: "15 mnt", tag: ["const", "typeof", "??"] },
  { id: 3, judul: "Scope, TDZ, dan Closure", tingkat: "Menengah", durasi: "20 mnt", tag: ["closure", "lexical"] },
  { id: 8, judul: "Event Loop, Promise, dan Async/Await", tingkat: "Lanjut", durasi: "25 mnt", tag: ["promise", "microtask"] },
  { id: 9, judul: "Fetch API & AbortController", tingkat: "Menengah", durasi: "20 mnt", tag: ["fetch", "json", "timeout"] },
  { id: 13, judul: "Keamanan Front-End (XSS & CSP)", tingkat: "Lanjut", durasi: "20 mnt", tag: ["xss", "cors", "csp"] }
];

const penyimpan = new PenyimpanProgres();
const stateFilter = { kataKunci: "", tingkat: "semua" };

const inputCari = document.querySelector("#input-cari");
const pilihTingkat = document.querySelector("#pilih-tingkat");
const wadahDaftar = document.querySelector("#daftar-modul");
const teksProgres = document.querySelector("#ringkasan-progres");
const cetakanKartu = document.querySelector("#cetakan-kartu-modul");

function renderAplikasi() {
  const hasilSaring = saringModul(DATA_MODUL_AWAL, stateFilter);

  const simpulKartu = hasilSaring.map((modul) => {
    const fragmen = cetakanKartu.content.cloneNode(true);
    const artikel = fragmen.querySelector(".kartu-modul");
    const judulEl = fragmen.querySelector(".kartu-modul__judul");
    const infoEl = fragmen.querySelector(".kartu-modul__info");
    const tombol = fragmen.querySelector(".tombol-selesai");

    const sudahSelesai = penyimpan.apakahSelesai(modul.id);

    artikel.dataset.id = String(modul.id);
    artikel.classList.toggle("kartu-modul--selesai", sudahSelesai);

    // 100% Aman dari XSS karena menggunakan textContent
    judulEl.textContent = `${modul.id}. ${modul.judul}`;
    infoEl.textContent = `${modul.tingkat} · ${modul.durasi} · Tag: ${modul.tag.join(", ")}`;

    tombol.dataset.aksi = "toggle-selesai";
    tombol.setAttribute("aria-pressed", String(sudahSelesai));
    tombol.textContent = sudahSelesai ? "✓ Selesai Dipelajari" : "Tandai Selesai";

    return fragmen;
  });

  wadahDaftar.replaceChildren(...simpulKartu);

  const { selesai, total, persen } = penyimpan.hitungRingkasan(DATA_MODUL_AWAL.length);
  teksProgres.textContent = `Progres Belajar: ${selesai} dari ${total} modul selesai (${persen}%)`;
}

// 1. Event Delegation: Cukup SATU listener untuk seluruh tombol di dalam daftar!
wadahDaftar.addEventListener("click", (event) => {
  const tombol = event.target.closest("button[data-aksi='toggle-selesai']");
  if (!tombol || !wadahDaftar.contains(tombol)) return;

  const kartu = tombol.closest(".kartu-modul");
  const idModul = Number(kartu?.dataset.id);
  if (!idModul) return;

  penyimpan.toggleModul(idModul);
  renderAplikasi();
});

// 2. Pencarian dengan Debounce
const jalankanPencarian = buatDebounce((nilai) => {
  stateFilter.kataKunci = nilai;
  renderAplikasi();
}, 180);

inputCari.addEventListener("input", (e) => jalankanPencarian(e.target.value));

pilihTingkat.addEventListener("change", (e) => {
  stateFilter.tingkat = e.target.value;
  renderAplikasi();
});

// 3. Sinkronisasi Lintas Tab secara Real-Time
window.addEventListener("storage", (event) => {
  if (event.key === "kodeloka:modul-selesai:v1") {
    penyimpan.muatUlang();
    renderAplikasi();
  }
});

renderAplikasi();
```

### 3. Berkas Pengujian Otomatis (`store.test.js`)

```js
// Berkas: ./store.test.js
// Jalankan dengan: node --test store.test.js
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { PenyimpanProgres, saringModul } from "./store.js";

describe("saringModul()", () => {
  const sampel = [
    { id: 1, judul: "Dasar HTML", tingkat: "Dasar", tag: ["markup", "dom"] },
    { id: 2, judul: "Async JavaScript", tingkat: "Lanjut", tag: ["promise", "fetch"] }
  ];

  it("menyaring berdasarkan kata kunci pada judul maupun tag tanpa peka huruf besar/kecil", () => {
    const hasil = saringModul(sampel, { kataKunci: "FETCH" });
    assert.equal(hasil.length, 1);
    assert.equal(hasil[0].id, 2);
  });

  it("menyaring berdasarkan tingkat kesulitan", () => {
    const hasil = saringModul(sampel, { tingkat: "Dasar" });
    assert.equal(hasil.length, 1);
    assert.equal(hasil[0].judul, "Dasar HTML");
  });
});

describe("PenyimpanProgres", () => {
  it("menambah dan menghapus status selesai modul serta menghitung persentase dengan akurat", () => {
    const store = new PenyimpanProgres("kunci-uji");
    assert.equal(store.apakahSelesai(1), false);

    store.toggleModul(1);
    assert.equal(store.apakahSelesai(1), true);
    assert.deepEqual(store.hitungRingkasan(4), { selesai: 1, total: 4, persen: 25 });

    store.toggleModul(1);
    assert.equal(store.apakahSelesai(1), false);
  });
});
```

## Kuis Pemahaman

### Soal 1
Dalam proyek aplikasi di atas, mengapa fungsi `saringModul` dan class `PenyimpanProgres` dipisahkan ke dalam berkas `store.js` yang tidak menyentuh `document.querySelector` sama sekali?
- A. Karena berkas `app.js` tidak mendukung penggunaan kata kunci `class`.
- B. Agar logika bisnis dan pengelolaan data terpisah bersih dari ketergantungan DOM peramban (*separation of concerns*), sehingga `store.js` dapat langsung diuji secara cepat di terminal menggunakan `node --test store.test.js` tanpa memerlukan peramban!
- C. Agar variabel di dalam `store.js` otomatis menjadi variabel global.
- D. Karena `localStorage` tidak bisa dipanggil dari berkas yang memiliki `querySelector`.

**Jawaban Benar:** B
**Penjelasan:** Memisahkan logika pengolahan data murni (`store.js`) dari manipulasi antarmuka DOM (`app.js`) merupakan prinsip arsitektur perangkat lunak yang sangat penting: logika inti menjadi mudah dibaca, mudah digunakan ulang, dan dapat diuji langsung dengan *unit test* di Node.js dalam hitungan milidetik.

### Soal 2
Bagaimana aplikasi di atas memastikan pengguna pembaca layar mengetahui apakah tombol *"Tandai Selesai"* pada suatu kartu modul sedang dalam keadaan aktif (sudah selesai) atau belum?
- A. Hanya dengan mengubah warna latar belakang tombol menjadi hijau di CSS.
- B. Dengan memperbarui atribut `tombol.setAttribute("aria-pressed", String(sudahSelesai))` menjadi `"true"` atau `"false"` sekaligus memperbarui `textContent` tombolnya.
- C. Dengan menyembunyikan tombol menggunakan `display: none`.
- D. Dengan memindahkan tombol ke bagian bawah halaman.

**Jawaban Benar:** B
**Penjelasan:** Mengandalkan perubahan warna saja tidak dapat diamati oleh pengguna pembaca layar. Memasang atribut `aria-pressed="true"` / `"false"` menjadikan tombol tersebut sebagai *toggle button* aksesibel yang statusnya diumumkan secara jelas oleh pembaca layar.

### Soal 3
Apa peran dari `cetakanKartu.content.cloneNode(true)` saat merender daftar kartu modul di dalam fungsi `renderAplikasi()`?
- A. Mengunduh ulang berkas HTML dari server untuk setiap kartu.
- B. Menggandakan seluruh struktur pohon elemen di dalam `<template id="cetakan-kartu-modul">` secara mendalam (*deep clone*) di memori, sehingga kita tinggal mengisi `textContent` dan atributnya tanpa perlu merangkai `innerHTML` atau puluhan `createElement` manual.
- C. Menghapus elemen `<template>` dari halaman setelah kartu pertama dibuat.
- D. Menyimpan elemen kartu ke dalam `IndexedDB`.

**Jawaban Benar:** B
**Penjelasan:** Argumen `true` pada `cloneNode(true)` melakukan penggandaan mendalam (*deep clone*) terhadap isi `DocumentFragment` milik `<template>`, yang kemudian diisi dengan `textContent` secara aman dan dimasukkan sekaligus ke dalam DOM melalui `wadahDaftar.replaceChildren(...simpulKartu)`.

## Sumber
- [JavaScript Guide — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide)
- [Document Object Model (DOM) — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model)
- [Using the Web Storage API — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API)
- [Using the Fetch API — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch)
