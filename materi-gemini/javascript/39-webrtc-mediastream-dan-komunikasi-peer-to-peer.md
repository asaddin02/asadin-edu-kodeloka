# Akses Kamera/Mikrofon (`getUserMedia`), Rekam Layar (`getDisplayMedia`), dan Pengantar WebRTC

- **Tingkat:** Lanjut
- **Ringkasan:** Meminta izin akses kamera dan mikrofon pengguna secara aman dengan `navigator.mediaDevices.getUserMedia()`, menangkap tampilan layar dengan `getDisplayMedia()`, merekam aliran media dengan `MediaRecorder`, serta memahami arsitektur dasar `RTCPeerConnection` pada WebRTC.

## Mengapa Lampu Indikator Kamera Pengguna Tetap Menyala Meskipun `<video>` Sudah Dihapus?

Salah satu bug paling memalukan pada aplikasi konferensi video atau pengambil foto profil adalah ketika pengguna menutup modal kamera, elemen `<video>` sudah disembunyikan atau `video.srcObject = null` sudah dijalankan, tetapi **lampu hijau/putih indikator kamera di laptop pengguna tetap menyala terus**!

Penyebabnya: objek **`MediaStream`** yang dikembalikan oleh `navigator.mediaDevices.getUserMedia()` terdiri dari satu atau beberapa jalur perangkat keras aktif (**`MediaStreamTrack`** untuk video dan audio). Mengosongkan `videoElement.srcObject = null` hanya melepas tampilan dari elemen HTML, tetapi **tidak mematikan sensor kamera fisik**. Anda wajib memanggil **`track.stop()`** pada setiap jalur di dalam `stream.getTracks()`!

> **⚠️ Jebakan Umum di Lapangan:** Menutup tampilan video kamera di layar hanya dengan mengosongkan `videoElement.srcObject = null` tanpa memanggil `stream.getTracks().forEach(t => t.stop())` akan membuat lampu indikator kamera pengguna tetap menyala terus-menerus!

## 1. Perbandingan Ekosistem Media Capture, Recording, dan WebRTC

Seluruh API akses kamera dan layar hanya tersedia di dalam **Secure Context (`https://` atau `localhost`)**:

| API / Kelas | Kegunaan Utama | Detail Teknis Penting |
| :--- | :--- | :--- |
| `navigator.mediaDevices.getUserMedia(constraints)` | Meminta akses ke kamera (`video`) dan/atau mikrofon (`audio`) perangkat pengguna. | Mendukung batasan resolusi ideal (`width: { ideal: 1280 }`) dan arah kamera ponsel (`facingMode: "user" \| "environment"`). |
| `navigator.mediaDevices.getDisplayMedia(options)` | Meminta pengguna memilih jendela, tab, atau seluruh layar untuk dibagikan (*screen sharing*). | Tidak pernah bisa diaktifkan tanpa klik pengguna aktif; pengguna memilih sendiri layar mana yang ingin dibagikan. |
| `MediaRecorder(stream, options)` | Merekam `MediaStream` menjadi potongan `Blob` video/audio (misalnya `video/webm;codecs=vp9,opus`). | Potongan rekaman dikumpulkan lewat event `dataavailable`, lalu disatukan menjadi `new Blob(chunks)` saat `stop`. |
| `RTCPeerConnection` | Mengalirkan audio, video, atau data biner (`RTCDataChannel`) secara **Peer-to-Peer (P2P)** langsung antar-peramban dengan latensi ultra-rendah. | Membutuhkan pertukaran sesi **SDP (*Offer/Answer*)** melalui server *Signaling* dan penemuan jalur jaringan **ICE (STUN/TURN)**. |

## 2. Membuka Kamera, Menghentikan Track dengan Bersih, dan Merekam dengan `MediaRecorder`

Berikut adalah pola lengkap untuk menyalakan pratinjau kamera pada elemen `<video>`, menyediakan fungsi pembersih yang mematikan perangkat keras kamera, serta merekam klip video lokal menggunakan `MediaRecorder`:

```javascript
export async function mulaiKamera(elemenVideo) {
  const stream = await navigator.mediaDevices.getUserMedia({
    video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: "user" },
    audio: false
  });
  elemenVideo.srcObject = stream;
  return () => {
    // Fungsi pembersih wajib untuk mematikan perangkat keras kamera
    for (const track of stream.getTracks()) track.stop();
    elemenVideo.srcObject = null;
  };
}

export function buatPerekamStream(stream) {
  const potonganBlob = [];
  const tipeMime = MediaRecorder.isTypeSupported("video/webm;codecs=vp9,opus")
    ? "video/webm;codecs=vp9,opus"
    : "video/webm";

  const perekam = new MediaRecorder(stream, { mimeType: tipeMime });
  perekam.addEventListener("dataavailable", (e) => {
    if (e.data && e.data.size > 0) potonganBlob.push(e.data);
  });

  return {
    mulai: () => perekam.start(),
    berhenti: () =>
      new Promise((resolve) => {
        perekam.addEventListener("stop", () => {
          resolve(new Blob(potonganBlob, { type: tipeMime }));
        }, { once: true });
        perekam.stop();
      })
  };
}
```

## 3. Memahami Alur Jabat Tangan WebRTC (`Signaling`, `SDP`, dan `ICE`)

Banyak pemula mengira `RTCPeerConnection` dapat langsung menghubungkan dua peramban di internet tanpa server sama sekali. Kenyataannya, sebelum koneksi P2P terbentuk, kedua peramban membutuhkan **Server Signaling** (biasanya melalui WebSocket atau SSE) untuk mempertukarkan dua informasi:
1. **SDP (*Session Description Protocol* — `createOffer` / `createAnswer`):** Menyepakati codec video/audio dan parameter enkripsi yang didukung kedua peramban.
2. **ICE Candidates (*Interactive Connectivity Establishment*):** Daftar alamat IP dan port kandidat yang ditemukan melalui server **STUN** (untuk mengetahui IP publik di balik router NAT) atau server **TURN** (sebagai *relay* cadangan apabila jaringan perusahaan/seluler memblokir koneksi P2P langsung).

## 4. Kesalahan Umum dan Cara Menghindarinya

1. **Menggunakan batasan `exact` yang kaku pada `getUserMedia` tanpa alasan kuat:** Menulis `video: { width: { exact: 1920 } }` akan langsung gagal dengan `OverconstrainedError` pada laptop yang kameranya hanya beresolusi 720p! Gunakan **`{ ideal: 1280 }`** agar peramban memilih resolusi terdekat yang didukung perangkat.
2. **Tidak menangani saat pengguna menghentikan berbagi layar dari tombol bawaan peramban:** Saat memakai `getDisplayMedia()`, peramban menampilkan tombol *"Stop sharing"* mengambang. Pasang pendengar `stream.getVideoTracks()[0].addEventListener("ended", ...)` agar antarmuka aplikasi Anda langsung memperbarui statusnya ketika pengguna menekan tombol tersebut.
3. **Lupa membedakan alasan penolakan `getUserMedia()`:** Tangkap eksepsi dan periksa `err.name`: `"NotAllowedError"` berarti pengguna menolak izin kamera, sedangkan `"NotFoundError"` berarti perangkat pengguna memang tidak memiliki kamera yang terpasang.

## Latihan Praktik Mandiri

1. Buat halaman `studio-rekam.html` dengan elemen `<video autoplay muted playsinline>`, tombol "Nyalakan Kamera", tombol "Matikan Kamera", dan tombol "Ambil Foto ke Canvas".
2. Saat tombol "Ambil Foto ke Canvas" diklik, gambar frame video saat ini ke elemen `<canvas>` menggunakan `ctx.drawImage(videoElement, 0, 0, lebar, tinggi)` dan ekspor menjadi `Blob` gambar WebP menggunakan `canvas.toBlob(cb, "image/webp", 0.85)`.
3. Pastikan tombol "Matikan Kamera" memanggil `.stop()` pada seluruh `stream.getTracks()` sehingga lampu kamera perangkat benar-benar mati.

## Kuis Pemahaman

### Soal 1
Mengapa mengatur `elemenVideo.srcObject = null` saja **tidak cukup** untuk mematikan kamera pengguna setelah fitur pratinjau kamera ditutup?
- A. Karena `srcObject` hanya bisa diisi dengan string URL
- B. Karena sensor perangkat keras kamera tetap aktif selama objek `MediaStreamTrack` di dalam `MediaStream` belum dihentikan; Anda wajib memanggil `track.stop()` pada setiap elemen dari `stream.getTracks()`
- C. Karena kamera hanya bisa dimatikan dengan menutup seluruh aplikasi peramban
- D. Karena `getUserMedia` berjalan di dalam Service Worker

**Jawaban Benar:** B
**Penjelasan:** `elemenVideo.srcObject = null` hanya memutus hubungan antara elemen `<video>` dan `MediaStream`. Untuk melepaskan perangkat keras kamera/mikrofon dan mematikan lampu indikatornya, setiap `MediaStreamTrack` harus dihentikan dengan `.stop()`.

### Soal 2
Mengapa dalam konfigurasi `navigator.mediaDevices.getUserMedia({ video: { width: { ideal: 1280 } } })`, penggunaan kata kunci `ideal` jauh lebih disarankan dibandingkan `exact`?
- A. Karena `ideal` membuat ukuran video menjadi dua kali lebih besar
- B. Karena dengan `ideal`, peramban akan memilih resolusi kamera yang paling mendekati `1280` tanpa gagal jika kamera pengguna hanya mendukung 720p, sedangkan `exact` akan langsung melempar `OverconstrainedError` jika kamera tidak mendukung angka tersebut secara persis
- C. Karena `exact` hanya berlaku untuk mikrofon audio
- D. Karena `ideal` tidak membutuhkan izin dari pengguna

**Jawaban Benar:** B
**Penjelasan:** Perangkat pengguna memiliki kemampuan kamera yang sangat beragam. Kata kunci `ideal` memberi bobot preferensi kepada peramban tanpa menggagalkan permintaan apabila perangkat keras tidak memiliki resolusi persis tersebut.

### Soal 3
Dalam arsitektur komunikasi *Peer-to-Peer* **WebRTC (`RTCPeerConnection`)**, apakah fungsi dari server **STUN** dan **TURN**?
- A. STUN digunakan untuk menyimpan kata sandi pengguna di database, sedangkan TURN digunakan untuk merender halaman HTML
- B. STUN membantu peramban menemukan alamat IP publik dan port miliknya di balik router NAT untuk membangun jalur P2P langsung, sedangkan TURN berfungsi sebagai server penerus (*relay*) cadangan apabila koneksi P2P langsung diblokir oleh firewall/NAT simetris
- C. Keduanya digunakan untuk menggantikan CSS Grid
- D. STUN hanya untuk audio, sedangkan TURN hanya untuk teks

**Jawaban Benar:** B
**Penjelasan:** Perangkat pengguna umumnya berada di balik jaringan privat (NAT). Server STUN memberi tahu kandidat IP/port publik perangkat, dan jika koneksi langsung tetap terhalang firewall ketat, server TURN meneruskan paket media antar-peserta.

## Sumber

- [Media Capture and Streams API — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/API/Media_Capture_and_Streams_API)
- [`MediaDevices.getUserMedia()` — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia)
- [WebRTC API — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API)
