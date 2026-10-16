# Membangun Elemen Kustom Mandiri dengan Web Components (`customElements` & Shadow DOM)

- **Tingkat:** Lanjut
- **Ringkasan:** Menciptakan tag HTML kustom milik sendiri (seperti `<lencana-status>` atau `<kartu-kode>`) menggunakan standar Custom Elements API (`customElements.define`), mengelola metode siklus hidup (`connectedCallback`, `disconnectedCallback`, `attributeChangedCallback`), serta mengenkapsulasi DOM dengan `attachShadow`.

## 1. Apa Itu Custom Elements di JavaScript?

Pernahkah Anda ingin membuat komponen antarmuka (misalnya tombol salin kode `<tombol-salin>` atau kartu peringatan `<kotak-info>`) yang dapat dipakai di halaman mana saja—baik di halaman HTML statis, di proyek PHP, maupun di berbagai framework—cukup dengan menulis tag HTML-nya saja?

Standar **Custom Elements** (bagian dari spesifikasi HTML dan DOM yang berstatus **Baseline Widely Available**) memungkinkan Anda mendaftarkan tag HTML baru ke peramban dengan mewarisi kelas **`HTMLElement`**!

> **⚠️ Aturan Wajib Nama Tag Custom Element:**
> Nama tag elemen kustom **wajib menggunakan huruf kecil dan mengandung minimal satu tanda hubung (`-`)**—misalnya `<kartu-kodeloka>`, `<tombol-salin>`, atau `<grafik-metrik>`.
> Mengapa wajib ada tanda hubung `-`? Agar peramban dan spesifikasi HTML di masa depan dijamin tidak akan pernah bentrok dengan nama elemen bawaan HTML (karena semua elemen bawaan HTML seperti `<dialog>`, `<search>`, `<article>` selalu terdiri dari satu kata tanpa tanda hubung!).

## 2. Siklus Hidup (*Lifecycle Callbacks*) Sebuah Custom Element

Ketika Anda mendefinisikan `class KomponenSaya extends HTMLElement`, peramban secara otomatis memanggil metode-metode siklus hidup khusus ini:

| Metode Siklus Hidup | Kapan Dipanggil oleh Peramban? | Kegunaan Utama |
|---|---|---|
| `constructor()` | Saat instans elemen pertama kali diciptakan di memori. | Membuat Shadow Root (`this.attachShadow({ mode: "open" })`) atau menginisialisasi state internal. Jangan mengakses atribut/anak di sini! |
| **`connectedCallback()`** | Setiap kali elemen **dimasukkan ke dalam dokumen DOM aktif**. | **Tempat utama untuk merender tampilan**, membaca atribut awal, dan memasang *event listener*! |
| **`disconnectedCallback()`** | Setiap kali elemen **dicabut/dihapus dari dokumen DOM**. | **Tempat wajib untuk membersihkan sumber daya:** menghapus timer `clearInterval`, memutus `IntersectionObserver.disconnect()`, atau menutup koneksi! |
| **`static observedAttributes`** & **`attributeChangedCallback(nama, nilaiLama, nilaiBaru)`** | Setiap kali salah satu atribut yang terdaftar di dalam `observedAttributes` ditambahkan, diubah, atau dihapus. | Memperbarui tampilan komponen secara reaktif saat atribut HTML-nya diubah! |

## 3. Contoh Lengkap: Membangun Komponen `<tombol-salin>` yang Mandiri

Mari kita bangun sebuah elemen kustom `<tombol-salin target="#kode-1"></tombol-salin>` yang lengkap dengan isolasi gaya Shadow DOM, penyalinan ke papan klip (`navigator.clipboard.writeText`), dan pembersihan timer yang aman:

```js
class TombolSalin extends HTMLElement {
  // 1. Daftarkan atribut mana saja yang perubahannya ingin kita pantau
  static observedAttributes = ["label"];

  #shadow;
  #timerReset = null;

  constructor() {
    super();
    // 2. Buat Shadow DOM terisolasi agar gaya tombol tidak terpengaruh CSS luar
    this.#shadow = this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.#render();
    this.#shadow
      .querySelector("button")
      ?.addEventListener("click", () => this.#salinTeks());
  }

  disconnectedCallback() {
    // 3. Bersihkan timer jika elemen dihapus dari DOM sebelum 2 detik selesai
    clearTimeout(this.#timerReset);
  }

  attributeChangedCallback(nama, nilaiLama, nilaiBaru) {
    if (nama === "label" && nilaiLama !== nilaiBaru) {
      const span = this.#shadow.querySelector(".teks-label");
      if (span) span.textContent = nilaiBaru ?? "Salin Kode";
    }
  }

  async #salinTeks() {
    const selektorTarget = this.getAttribute("target");
    const elemenKode = selektorTarget ? document.querySelector(selektorTarget) : null;
    if (!elemenKode) return;

    const spanLabel = this.#shadow.querySelector(".teks-label");
    try {
      await navigator.clipboard.writeText(elemenKode.textContent ?? "");
      spanLabel.textContent = "✓ Tersalin!";

      clearTimeout(this.#timerReset);
      this.#timerReset = setTimeout(() => {
        spanLabel.textContent = this.getAttribute("label") ?? "Salin Kode";
      }, 2000);
    } catch {
      spanLabel.textContent = "Gagal menyalin";
    }
  }

  #render() {
    const labelAwal = this.getAttribute("label") ?? "Salin Kode";

    this.#shadow.innerHTML = `
      <style>
        button {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.35rem 0.75rem;
          border: 1px solid #cbd5e1;
          border-radius: 0.375rem;
          background: #ffffff;
          color: #0f172a;
          font: inherit;
          font-size: 0.8125rem;
          font-weight: 600;
          cursor: pointer;
        }
        button:hover {
          background: #f1f5f9;
        }
      </style>
      <button type="button">
        <span class="teks-label"></span>
      </button>
    `;

    // Gunakan textContent untuk menyisipkan nilai atribut secara aman dari XSS!
    this.#shadow.querySelector(".teks-label").textContent = labelAwal;
  }
}

// 4. Daftarkan tag <tombol-salin> ke registri elemen kustom peramban!
if (!customElements.get("tombol-salin")) {
  customElements.define("tombol-salin", TombolSalin);
}
```

Begitu skrip di atas dimuat, Anda dapat langsung menggunakan `<tombol-salin>` di mana saja di dalam HTML:

```html
<pre id="blok-perintah"><code>docker compose up -d --build</code></pre>
<tombol-salin target="#blok-perintah" label="Salin Perintah Docker"></tombol-salin>
```

## Latihan Praktik: Membangun Komponen `<lencana-status>` Reaktif

Buatlah berkas `custom-element.html` dan `lencana-status.js`:
1. Buat `class LencanaStatus extends HTMLElement` dengan `static observedAttributes = ["jenis", "teks"]`.
2. Ketika atribut `jenis` bernilai `"sehat"`, `"waspada"`, atau `"kritis"`, perbarui warna indikator di dalam Shadow DOM secara otomatis melalui `attributeChangedCallback`.
3. Daftarkan dengan `customElements.define("lencana-status", LencanaStatus)` dan uji perubahan atributnya melalui `setAttribute("jenis", "kritis")`.

## Kuis Pemahaman

### Soal 1
Mengapa pendaftaran `customElements.define("kartu", KartuKelas)` akan langsung ditolak oleh peramban dengan galat `SyntaxError`?
- A. Karena huruf pertama `"kartu"` tidak menggunakan huruf kapital.
- B. Karena spesifikasi Custom Elements mewajibkan setiap nama tag elemen kustom mengandung **minimal satu karakter tanda hubung (`-`)** (seperti `"kartu-kelas"`) agar tidak pernah berbenturan dengan nama elemen HTML standar masa kini maupun masa depan.
- C. Karena `customElements.define` hanya menerima maksimal 5 huruf.
- D. Karena class `KartuKelas` belum diekspor.

**Jawaban Benar:** B
**Penjelasan:** Semua elemen standar HTML terdiri dari satu kata tanpa tanda hubung (`<div>`, `<dialog>`, `<section>`). Kewajiban menyertakan tanda hubung (`-`) pada nama Custom Element menjamin ruang nama (*namespace*) elemen buatan pengembang terpisah dari elemen bawaan HTML.

### Soal 2
Agar metode `attributeChangedCallback(name, oldValue, newValue)` pada sebuah Custom Element terpanggil ketika atribut `data-status` atau `tingkat` diubah, apa yang wajib dideklarasikan di dalam class tersebut?
- A. Properti atau getter statis `static observedAttributes = ["data-status", "tingkat"];`.
- B. Sebuah `MutationObserver` manual di dalam `constructor()`.
- C. Metode `watchAllAttributes()`.
- D. Atribut `observable="true"` pada tag HTML-nya.

**Jawaban Benar:** A
**Penjelasan:** Demi efisiensi performa, peramban hanya memicu `attributeChangedCallback` untuk atribut-atribut yang namanya didaftarkan secara eksplisit di dalam array statis `static observedAttributes` (atau `static get observedAttributes()`).

### Soal 3
Di dalam metode siklus hidup manakah Anda harus membersihkan pengatur waktu (`clearInterval`), menghentikan `ResizeObserver`, atau melepas pendengar event global ketika sebuah Custom Element dihapus dari halaman?
- A. `constructor()`
- B. `connectedCallback()`
- C. `disconnectedCallback()`
- D. `adoptedCallback()`

**Jawaban Benar:** C
**Penjelasan:** `disconnectedCallback()` dipanggil oleh peramban tepat ketika elemen kustom dicabut dari dokumen DOM. Membersihkan timer dan pendengar eksternal di dalam metode ini mencegah kebocoran memori (*memory leak*).

## Sumber
- [Web Components — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/API/Web_components)
- [Using templates and slots — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_templates_and_slots)
