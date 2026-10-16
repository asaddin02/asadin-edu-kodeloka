# Manipulasi DOM yang Aman, Siklus Event, dan Event Delegation

- **Tingkat:** Menengah
- **Ringkasan:** Memilih dan memodifikasi elemen DOM menggunakan API modern (`querySelector`, `classList`, `dataset`, `createElement`, `replaceChildren`), memahami perambatan event (*bubbling* & *capturing*), serta mengoptimalkan kinerja dengan pola **Event Delegation**.

## 1. Memilih Elemen di Pohon DOM (`querySelector` & `querySelectorAll`)

Ketika peramban mengurai HTML menjadi pohon **DOM (*Document Object Model*)**, JavaScript dapat mencari elemen menggunakan selektor CSS apa pun melalui dua metode utama:

1. **`document.querySelector(selektor)`:** Mengembalikan **satu elemen pertama** yang cocok dengan selektor CSS tersebut, atau **`null`** jika tidak ditemukan.
2. **`document.querySelectorAll(selektor)`:** Mengembalikan **`NodeList` statis** berisi seluruh elemen yang cocok (dapat langsung diiterasi dengan `for...of`, atau diubah menjadi `Array` dengan `Array.from(nodeList)` jika Anda butuh `.map()` / `.filter()`).

```js
// Mencari satu elemen berdasarkan ID atau atribut
const formulir = document.querySelector("#form-kontak");
const tombolAktif = document.querySelector('button[aria-current="page"]');

// Mencari di dalam sub-pohon elemen tertentu (lebih cepat & terfokus!)
const semuaInputWajib = formulir.querySelectorAll("input[required], textarea[required]");

for (const input of semuaInputWajib) {
  console.log(input.name);
}
```

## 2. Membaca dan Mengubah Elemen, Kelas, dan Atribut `data-*`

### A. Mengubah Teks: Gunakan `textContent`, Hindari `innerHTML`!
- **`elemen.textContent = teksBaru`:** Mengatur isi teks murni secara cepat dan **100% aman dari celah injeksi skrip (XSS)** karena karakter `<script>` akan diperlakukan sebagai teks biasa, bukan dijalankan sebagai tag HTML!
- **`elemen.innerHTML = htmlString`:** Mengurai ulang string sebagai tag HTML. **Jangan pernah memasukkan data yang berasal dari pengguna atau URL ke dalam `innerHTML`!**

### B. Mengelola Kelas CSS dengan `classList` dan Data dengan `dataset`

```js
const kartu = document.querySelector(".kartu-modul");

// 1. Mengelola class tanpa merusak class lain yang sudah ada di elemen tersebut
kartu.classList.add("kartu--terpilih");
kartu.classList.remove("kartu--redup");
kartu.classList.toggle("kartu--terbuka", statusTerbuka); // Parameter ke-2 memaksa tambah/hapus berdasarkan boolean!

// 2. Membaca dan menulis atribut data-* (mis. data-modul-id="10" <-> dataset.modulId)
const idModul = Number(kartu.dataset.modulId);
kartu.dataset.statusBaca = "selesai"; // Menghasilkan atribut data-status-baca="selesai" di HTML
```

## 3. Membuat, Menyisipkan, dan Mengganti Elemen Secara Efisien

Untuk merakit elemen baru secara aman dan cepat:

```js
function buatItemModul({ id, judul, tingkat }) {
  const li = document.createElement("li");
  li.className = "item-modul";
  li.dataset.id = String(id);

  const tautan = document.createElement("a");
  tautan.href = `#modul-${id}`;
  tautan.textContent = judul;

  const lencana = document.createElement("span");
  lencana.className = "lencana";
  lencana.textContent = tingkat;

  // .append() dapat menerima beberapa elemen sekaligus maupun teks biasa!
  li.append(tautan, " ", lencana);
  return li;
}

// Merender daftar 50 item sekaligus ke dalam <ul> dengan satu kali pembaruan DOM:
const wadahDaftar = document.querySelector("#daftar-modul");
const elemenBaru = daftarData.map(buatItemModul);

// replaceChildren() mengosongkan isi lama sekaligus memasukkan seluruh elemen baru dalam satu langkah!
wadahDaftar.replaceChildren(...elemenBaru);
```

> **💡 Keunggulan `elemen.replaceChildren(...anakBaru)`:**
> Daripada mengosongkan daftar dengan `wadah.innerHTML = ""` lalu memanggil `appendChild()` berulang-ulang di dalam perulangan (yang memicu perhitungan tata letak berulang kali), `wadah.replaceChildren(...elemenBaru)` (status **Baseline Widely Available**) mengganti seluruh anak elemen secara atomik dan jauh lebih rapi!

## 4. Menangani Event, *Event Bubbling*, dan Pola *Event Delegation*

Gunakan **`elemen.addEventListener(tipeEvent, fungsiHandler)`** untuk merespons interaksi pengguna (seperti `"click"`, `"submit"`, `"input"`, `"keydown"`).

### Bagaimana Event Merambat di Pohon DOM? (*Capturing* & *Bubbling*)
Ketika pengguna mengeklik sebuah `<button>` yang berada di dalam `<li>` → `<ul>` → `<main>` → `<body>`:
1. **Fase Capturing (Turun):** Event berjalan turun dari `window` → `document` → `<body>` → `<main>` → `<ul>` → `<li>`.
2. **Fase Target:** Event tiba di `<button>` yang diklik.
3. **Fase Bubbling (Menggelembung Naik — Bawaan):** Event merambat naik kembali ke atas melalui `<li>` → `<ul>` → `<main>` → `<body>` → `document`!

```
          [ document ]
            │      ▲
  1. Capture│      │3. Bubble (Secara bawaan addEventListener mendengarkan di fase ini!)
            ▼      │
           [  <ul>  ]  <-- Pasang SATU event listener di sini (Event Delegation!)
            │      ▲
            ▼      │
           [  <li>  ]
            │      ▲
            ▼      │
         [ <button> ]  <-- 2. Target yang diklik pengguna
```

### Kekuatan *Event Delegation* dengan `event.target.closest()`
Bayangkan Anda memiliki daftar `<ul>` yang berisi **200 tombol hapus item**, dan item baru dapat ditambahkan secara dinamis kapan saja.
- **Cara Buruk:** Memasang 200 `addEventListener("click", ...)` pada masing-masing tombol (boros memori, dan tombol yang baru ditambahkan belakangan tidak akan memiliki event listener!).
- **Cara Terbaik (*Event Delegation*):** Pasang **cukup SATU `addEventListener` pada elemen induk `<ul>`**, lalu gunakan **`event.target.closest("button.tombol-hapus")`** untuk mendeteksi tombol mana yang baru saja diklik!

```js
const daftarTugas = document.querySelector("#daftar-tugas");

daftarTugas.addEventListener("click", (event) => {
  // .closest() mencari ke diri sendiri atau ke induk terdekat jika yang terklik adalah <svg> di dalam <button>!
  const tombolHapus = event.target.closest("button[data-aksi='hapus']");

  // Jika klik terjadi di luar tombol hapus, abaikan
  if (!tombolHapus || !daftarTugas.contains(tombolHapus)) return;

  const barisItem = tombolHapus.closest("li");
  const idTugas = barisItem?.dataset.id;

  console.log(`Menghapus tugas #${idTugas}`);
  barisItem?.remove();
});
```

> **⚠️ Mengapa Wajib Menggunakan `event.target.closest("button")` dan Bukan `event.target` Saja?**
> Di dalam `<button>`, sering kali terdapat elemen anak seperti `<span>` atau ikon `<svg>`. Saat pengguna mengeklik tepat di atas gambar ikon `<svg>`, maka **`event.target` adalah elemen `<svg>` tersebut, bukan `<button>`!** Dengan `event.target.closest("button")`, pencarian akan naik dari `<svg>` ke elemen `<button>` pembungkusnya secara akurat.

## Latihan Praktik: Daftar Catatan Belajar Interaktif dengan Event Delegation

Buatlah berkas `dom-catatan.html` dan `catatan.js`:
1. Buat formulir `<form id="form-catatan">` dengan input teks untuk menambah catatan baru ke dalam `<ul id="daftar-catatan">` (gunakan `event.preventDefault()` pada event `"submit"` agar halaman tidak memuat ulang).
2. Setiap item `<li>` dibuat menggunakan `document.createElement` dan `textContent`, dilengkapi tombol *Tandai Selesai* (`data-aksi="selesai"`) dan tombol *Hapus* (`data-aksi="hapus"`).
3. Gunakan **satu** event listener pada `#daftar-catatan` (*Event Delegation*) untuk menangani kedua tombol aksi tersebut.

## Kuis Pemahaman

### Soal 1
Apa perbedaan antara `event.target` dan `event.currentTarget` di dalam fungsi *event handler* yang menggunakan pola *Event Delegation* pada elemen `<ul id="daftar">`?
- A. Keduanya selalu menunjuk ke elemen `<ul>`.
- B. `event.target` adalah elemen paling spesifik tempat interaksi benar-benar terjadi (misalnya `<button>` atau `<svg>` yang diklik), sedangkan `event.currentTarget` adalah elemen tempat `addEventListener` dipasang (yaitu `<ul id="daftar">`).
- C. `event.currentTarget` hanya tersedia pada event papan ketik, sedangkan `event.target` pada event tetikus.
- D. `event.target` menunjuk ke elemen `<body>`.

**Jawaban Benar:** B
**Penjelasan:** Saat event menggelembung (*bubbling*) naik ke atas, `event.target` tetap menunjuk ke elemen terdalam yang memicu event, sementara `event.currentTarget` menunjuk ke elemen pemilik listener yang sedang mengeksekusi callback saat ini.

### Soal 2
Mengapa `event.target.closest("button.aksi")` jauh lebih andal daripada memeriksa `event.target.matches("button.aksi")` saat menerapkan *Event Delegation*?
- A. Karena `.matches()` sudah dihapus dari spesifikasi DOM.
- B. Karena jika di dalam `<button class="aksi">` terdapat elemen anak seperti `<svg>` atau `<span>` dan pengguna mengeklik tepat di atas ikon `<svg>` tersebut, `event.target` adalah `<svg>`; metode `.closest("button.aksi")` akan menelusuri naik hingga menemukan elemen `<button class="aksi">` pembungkusnya.
- C. Karena `.closest()` otomatis memanggil `event.preventDefault()`.
- D. Karena `.closest()` mencari elemen saudara (*sibling*) di sebelah kanan.

**Jawaban Benar:** B
**Penjelasan:** `elemen.closest(selektor)` memeriksa elemen itu sendiri terlebih dahulu, lalu apabila belum cocok, ia menelusuri rantai induknya ke atas hingga menemukan elemen yang cocok (atau mengembalikan `null`). Hal ini menyelesaikan masalah klik pada ikon atau teks di dalam tombol.

### Soal 3
Mengapa kita harus mengutamakan `elemen.textContent = inputPengguna` daripada `elemen.innerHTML = inputPengguna` ketika menampilkan teks yang berasal dari masukan pengguna?
- A. Karena `innerHTML` tidak dapat menampilkan angka.
- B. Karena `textContent` memasukkan nilai sebagai teks murni tanpa mengurainya sebagai markup HTML, sehingga mencegah eksekusi tag `<script>` atau atribut berbahaya (*Cross-Site Scripting / XSS*).
- C. Karena `textContent` otomatis menerjemahkan teks ke Bahasa Indonesia.
- D. Karena `innerHTML` hanya bekerja pada elemen `<div>`.

**Jawaban Benar:** B
**Penjelasan:** `innerHTML` memicu parser HTML yang dapat mengeksekusi muatan berbahaya seperti `<img src="x" onerror="alert(1)">`. Sebaliknya, `textContent` lebih cepat karena melewati parser HTML dan memperlakukan seluruh karakter sebagai teks literal yang aman.

## Sumber
- [Document Object Model (DOM) — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model)
- [`EventTarget: addEventListener()` method — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener)
- [`Event` — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/API/Event)
