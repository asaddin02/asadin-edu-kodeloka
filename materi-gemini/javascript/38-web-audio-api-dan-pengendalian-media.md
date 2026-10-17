# Pengendalian Media (`HTMLMediaElement`) dan Pemrosesan Suara dengan Web Audio API

- **Tingkat:** Menengah
- **Ringkasan:** Mengendalikan pemutaran `<audio>` dan `<video>` secara programatis, memahami kebijakan pemblokiran *Autoplay* peramban, mengintegrasikan kontrol layar kunci dengan **Media Session API (`navigator.mediaSession`)**, serta menyusun grafik audio dengan **Web Audio API (`AudioContext`)**.

## Mengapa `video.play()` Mengembalikan `Promise` dan Mengapa `AudioContext` Sering Berstatus `'suspended'`?

Di masa lalu, membuka sebuah halaman web sering kali disambut oleh suara iklan atau musik latar yang menyala tiba-tiba tanpa izin. Untuk melindungi kenyamanan pengguna dan menghemat kuota data seluler, seluruh peramban modern menerapkan **Kebijakan Autoplay (*Autoplay Policy*)** yang ketat: pemutaran media bersuara maupun pembangkitan gelombang suara melalui `AudioContext` **diblokir secara otomatis** sampai pengguna melakukan interaksi eksplisit di halaman tersebut (seperti `click`, `keydown`, atau `pointerdown`).

Itulah sebabnya metode **`mediaElement.play()`** di spesifikasi modern tidak lagi berjalan secara sinkron buta, melainkan **mengembalikan sebuah `Promise`** yang akan *resolve* jika pemutaran diizinkan, atau *reject* dengan **`NotAllowedError`** jika diblokir oleh kebijakan Autoplay!

> **⚠️ Jebakan Umum di Lapangan:** Membuat dan membunyikan `new AudioContext()` tepat saat halaman baru dimuat tanpa menunggu interaksi pengguna (`click`/`keydown`) akan diblokir oleh kebijakan Autoplay peramban dan membuat konteks audio tertahan dalam status `'suspended'`.

## 1. Perbandingan API Media di Peramban: `HTMLMediaElement`, `MediaSession`, dan `Web Audio API`

Platform web menyediakan tiga antarmuka yang saling melengkapi untuk menangani audio dan video:

| API | Peran Utama | Metode & Properti Kunci |
| :--- | :--- | :--- |
| **`HTMLMediaElement`** (`<audio>` & `<video>`) | Mengendalikan pemutaran berkas media streaming atau lokal. | `await el.play()`, `el.pause()`, `el.currentTime`, `el.duration`, `el.playbackRate`, `el.volume`, `el.muted`. |
| **`MediaSession` API** (`navigator.mediaSession`) | Menampilkan judul lagu/siniar, sampul album, dan tombol Putar/Jeda/Lompat di **layar kunci ponsel**, bilah notifikasi OS, dan tombol media papan ketik. | `navigator.mediaSession.metadata = new MediaMetadata({...})`, `setActionHandler("play", fn)`. |
| **Web Audio API** (`AudioContext`) | Pemrosesan dan sintesis sinyal audio waktu-nyata menggunakan grafik node modular (`Source -> Gain/Filter -> Destination`). | `ctx.createOscillator()`, `ctx.createGain()`, `ctx.createAnalyser()`, `await ctx.resume()`, `await ctx.close()`. |

## 2. Membunyikan Nada Sintesis dengan `AudioContext` dan Menutup Sumber Daya (`ctx.close()`)

Dalam **Web Audio API**, suara mengalir melalui grafik node yang terhubung ke `ctx.destination` (pengeras suara perangkat). Perhatikan bahwa setiap instans `new AudioContext()` mengalokasikan utas pemrosesan audio tingkat perangkat keras. Jika Anda membuat `new AudioContext()` untuk membunyikan nada pendek, **wajib tutup konteks tersebut dengan `ctx.close()`** setelah nada berakhir (atau gunakan satu instans `AudioContext` bersama yang di-`resume()`):

```javascript
export function bunyikanNadaNotifikasi(frekuensiHz = 880, durasiDetik = 0.15) {
  const ctx = new AudioContext();
  const osilator = ctx.createOscillator();
  const penguat = ctx.createGain();

  osilator.type = "sine";
  osilator.frequency.setValueAtTime(frekuensiHz, ctx.currentTime);
  penguat.gain.setValueAtTime(0.15, ctx.currentTime);
  // Turunkan volume secara eksponensial menuju mendekati nol agar tidak terdengar bunyi "klik" kasar di akhir
  penguat.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + durasiDetik);

  osilator.connect(penguat).connect(ctx.destination);
  osilator.start();
  osilator.stop(ctx.currentTime + durasiDetik);
  // Tutup konteks setelah nada selesai agar sumber daya audio dilepas dan konteks tidak menumpuk
  osilator.onended = () => ctx.close();
}
```

## 3. Menangani `mediaElement.play()` secara Aman dan Integrasi `navigator.mediaSession`

Saat membangun pemutar siniar (*podcast*) atau video kursus, selalu tangani `Promise` dari `.play()` dan daftarkan metadata ke `navigator.mediaSession` agar pengguna dapat menjeda atau mempercepat 10 detik langsung dari layar kunci ponsel atau tombol media *headphone* mereka:

```javascript
export async function putarMediaAman(elemenAudio, infoEpisode) {
  try {
    await elemenAudio.play();
  } catch (err) {
    if (err.name === "NotAllowedError") {
      console.warn("Pemutaran otomatis diblokir; menunggu klik pengguna.");
      return false;
    }
    throw err;
  }

  if ("mediaSession" in navigator) {
    navigator.mediaSession.metadata = new MediaMetadata({
      title: infoEpisode.judul,
      artist: "Kodeloka",
      album: infoEpisode.namaKelas,
      artwork: [{ src: infoEpisode.urlSampul, sizes: "512x512", type: "image/png" }]
    });

    navigator.mediaSession.setActionHandler("play", () => elemenAudio.play());
    navigator.mediaSession.setActionHandler("pause", () => elemenAudio.pause());
    navigator.mediaSession.setActionHandler("seekbackward", () => {
      elemenAudio.currentTime = Math.max(0, elemenAudio.currentTime - 10);
    });
    navigator.mediaSession.setActionHandler("seekforward", () => {
      elemenAudio.currentTime = Math.min(elemenAudio.duration || 0, elemenAudio.currentTime + 10);
    });
  }
  return true;
}
```

## 4. Kesalahan Umum dan Cara Menghindarinya

1. **Memanggil `osilator.start()` dua kali pada objek `OscillatorNode` atau `AudioBufferSourceNode` yang sama:** Di Web Audio API, node sumber suara dirancang **sekali pakai (*one-shot*)**. Setelah `osilator.stop()` dipanggil, Anda tidak bisa memanggil `osilator.start()` lagi pada node tersebut; buatlah `ctx.createOscillator()` baru (yang sangat ringan) untuk nada berikutnya.
2. **Memberikan nilai `0` bulat pada `exponentialRampToValueAtTime(0, waktu)`:** Rumus kurva eksponensial tidak dapat membagi dengan angka nol (`0`) dan akan langsung melempar `RangeError`! Gunakan angka positif yang sangat kecil seperti **`0.0001`** atau **`0.001`**.
3. **Tidak menangani penolakan Promise `video.play()`:** Memanggil `video.play()` tanpa `try...catch` atau `.catch()` akan memicu `UnhandledPromiseRejection` di peramban pengguna yang memblokir autoplay.

## Latihan Praktik Mandiri

1. Buat halaman `pemutar-siniar.html` dengan elemen `<audio>`, tombol Putar/Jeda, pemilih kecepatan putar (`1x`, `1.25x`, `1.5x`, `2x` yang mengubah `audio.playbackRate`), dan integrasi `navigator.mediaSession`.
2. Tambahkan tombol "Uji Suara Notifikasi" yang memanggil `bunyikanNadaNotifikasi(880, 0.15)` saat diklik.
3. Periksa di Console bahwa `AudioContext` berhasil ditutup setelah nada selesai diputar.

## Kuis Pemahaman

### Soal 1
Apa yang terjadi ketika kode JavaScript memanggil `elemenAudio.play()` pada elemen `<audio>` bersuara tepat saat halaman baru dimuat tanpa adanya interaksi klik/ketukan dari pengguna terlebih dahulu?
- A. Suara tetap diputar dengan volume 10%
- B. Pemutaran ditolak oleh kebijakan Autoplay peramban, dan `Promise` yang dikembalikan oleh `elemenAudio.play()` akan *reject* dengan `DOMException` bernama `"NotAllowedError"`
- C. Peramban otomatis menghapus elemen `<audio>` dari halaman
- D. Halaman otomatis dimuat ulang

**Jawaban Benar:** B
**Penjelasan:** Metode `HTMLMediaElement.prototype.play()` mengembalikan `Promise`. Jika pemutaran melanggar kebijakan Autoplay peramban (belum ada aktivasi pengguna dan media tidak dibisukan), Promise tersebut ditolak dengan `NotAllowedError`.

### Soal 2
Mengapa pada fungsi pembangkit nada pendek yang membuat `const ctx = new AudioContext()`, sangat penting untuk memanggil `ctx.close()` (misalnya pada `osilator.onended`) atau menggunakan ulang satu `AudioContext` tunggal?
- A. Karena `ctx.close()` otomatis menyimpan rekaman suara ke hard disk
- B. Karena setiap instans `AudioContext` membuka saluran perangkat keras audio sistem operasi yang terbatas jumlahnya; membuat `new AudioContext()` berulang kali tanpa menutupnya akan membocorkan sumber daya audio hingga peramban gagal mengeluarkan suara lagi
- C. Karena `AudioContext` hanya boleh hidup selama maksimal 1 detik
- D. Agar frekuensi suara naik dua kali lipat

**Jawaban Benar:** B
**Penjelasan:** Setiap `AudioContext` menahan sumber daya utas audio perangkat keras. Menutupnya dengan `ctx.close()` setelah selesai (atau memakai satu instans bersama) mencegah penumpukan konteks audio di memori.

### Soal 3
Mengapa pemanggilan `penguat.gain.exponentialRampToValueAtTime(0, ctx.currentTime + 1)` melempar galat `RangeError` di Web Audio API?
- A. Karena durasi ramp tidak boleh mencapai 1 detik
- B. Karena perhitungan transisi eksponensial secara matematis tidak dapat menuju nilai tepat `0` (atau nilai berlawanan tanda); gunakan nilai positif sangat kecil seperti `0.001` atau gunakan `linearRampToValueAtTime(0, ...)`
- C. Karena `GainNode` hanya menerima angka negatif
- D. Karena `ctx.currentTime` bertipe string

**Jawaban Benar:** B
**Penjelasan:** Spesifikasi Web Audio API menetapkan bahwa `exponentialRampToValueAtTime(value, endTime)` melempar `RangeError` apabila `value` bernilai `0` karena rasio logaritmik terhadap nol tidak terdefinisi.

## Sumber

- [Web Audio API — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
- [`HTMLMediaElement` — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement)
- [Autoplay guide for media and Web Audio APIs — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Autoplay)
