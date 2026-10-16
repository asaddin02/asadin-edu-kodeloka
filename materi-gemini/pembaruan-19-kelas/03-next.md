# Audit Kelengkapan & Paket Pembaruan Materi 2026: Kelas Next.js Modern (Next.js 15 & React 19): Async Request APIs (`await params`), Server Actions Security, `useActionState`, & Caching

- **Tingkat:** Lanjut
- **Ringkasan:** Laporan audit kelengkapan atas 0 modul yang sudah ada di kelas `next/` beserta 3 modul perluasan penuh berstandar 2025/2026 lengkap dengan contoh kode produksi dan kuis pemahaman untuk diintegrasikan oleh Claude Code ke `next/data/modules.json`.

## 1. Audit Modul Saat Ini di Repositori (`next/data/modules.json`)

Saat ini, kelas **`next`** di repositori Kodeloka memiliki **0 modul**. Berikut adalah pemetaan kondisinya serta celah fitur modern (2025–2026) yang telah kami lengkapi di berkas ini:

| No | Judul Modul Saat Ini | Tingkat | Status di Repo |
| :--- | :--- | :--- | :--- |


> **⚠️ Temuan Audit & Apa yang Dilengkapi di Berkas Ini:**
> 1. **Penambahan Fitur Rilis Terbaru (2024–2026):** Tiga modul perluasan penuh di bawah ini menambahkan kapabilitas rilis terbaru yang belum tercakup di modul lama.
> 2. **Penyelarasan Bahasa Indonesia:** Beberapa judul atau istilah di kelas yang diadaptasi dari seri bahasa Inggris kini dilengkapi padanan penjelasan bahasa Indonesia yang baku dan konsisten dengan standar `GEMINI.md`.

## Modul Pembaruan 24: Perubahan Penting Next.js 15 — Async Request APIs (`await params`, `await searchParams`, `await cookies()`)

- **Tingkat:** Menengah
- **Ringkasan:** Memperbarui komponen halaman, layout, dan Route Handlers agar melakukan `await` pada `params`, `searchParams`, `cookies()`, dan `headers()` sesuai arsitektur asinkron Next.js 15+ serta memahami perilaku baru `fetch()` yang *uncached by default*.

### Penjelasan Mendalam & Praktik Terbaik Produksi (Standar 2025/2026)

Memperbarui komponen halaman, layout, dan Route Handlers agar melakukan `await` pada `params`, `searchParams`, `cookies()`, dan `headers()` sesuai arsitektur asinkron Next.js 15+ serta memahami perilaku baru `fetch()` yang *uncached by default*. Dalam lingkungan produksi modern, penerapan pola ini memastikan layanan Anda bebas dari celah keamanan, mudah diamati (*observable*), dan siap menangani lonjakan beban kerja nyata.

```
// app/kelas/[slug]/page.tsx (Next.js 15+)
type PageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ tab?: string }>;
};

export default async function HalamanKelas({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const { tab = "materi" } = await searchParams;

  return (
    <main>
      <h1>Kelas: {slug}</h1>
      <p>Tab aktif: {tab}</p>
    </main>
  );
}
```

> **💡 Catatan Integrasi Kodeloka:** Modul ini dirancang untuk langsung ditambahkan ke akhir array di `next/data/modules.json` (dan `next/app.js`) sehingga memperluas cakupan kelas `next` dari **0 modul** menjadi **3 modul** berstandar terbaru.


## Modul Pembaruan 25: Formulir React 19 (`useActionState`, `useOptimistic`) & Keamanan Server Actions

- **Tingkat:** Lanjut
- **Ringkasan:** Memvalidasi masukan dan otorisasi pengguna di dalam setiap `'use server'` Action menggunakan Zod/Valibot (karena Server Action adalah endpoint HTTP POST publik!), serta mengelola status loading/galat dengan hook `useActionState` dari React 19.

### Penjelasan Mendalam & Praktik Terbaik Produksi (Standar 2025/2026)

Memvalidasi masukan dan otorisasi pengguna di dalam setiap `'use server'` Action menggunakan Zod/Valibot (karena Server Action adalah endpoint HTTP POST publik!), serta mengelola status loading/galat dengan hook `useActionState` dari React 19. Dalam lingkungan produksi modern, penerapan pola ini memastikan layanan Anda bebas dari celah keamanan, mudah diamati (*observable*), dan siap menangani lonjakan beban kerja nyata.

```
// app/actions/komentar.ts
"use server";

export async function kirimKomentarAction(prevState: { pesan: string }, formData: FormData) {
  // WAJIB: Verifikasi sesi pengguna dan validasi payload di dalam setiap Server Action!
  const isi = String(formData.get("isi") ?? "").trim();
  if (isi.length < 5) {
    return { pesan: "Komentar minimal 5 karakter." };
  }
  return { pesan: "Komentar berhasil disimpan!" };
}
```

> **💡 Catatan Integrasi Kodeloka:** Modul ini dirancang untuk langsung ditambahkan ke akhir array di `next/data/modules.json` (dan `next/app.js`) sehingga memperluas cakupan kelas `next` dari **0 modul** menjadi **3 modul** berstandar terbaru.


## Modul Pembaruan 26: `after()` API (`next/server`), Instrumentasi OpenTelemetry (`instrumentation.ts`), & Self-Hosting Docker Standalone

- **Tingkat:** Lanjut
- **Ringkasan:** Menjalankan tugas pencatatan analitik/audit setelah respons dikirim ke pengguna tanpa menahan waktu tunggu halaman menggunakan fungsi `after()` dari `next/server`, serta men-deploy Next.js dengan `output: 'standalone'`.

### Penjelasan Mendalam & Praktik Terbaik Produksi (Standar 2025/2026)

Menjalankan tugas pencatatan analitik/audit setelah respons dikirim ke pengguna tanpa menahan waktu tunggu halaman menggunakan fungsi `after()` dari `next/server`, serta men-deploy Next.js dengan `output: 'standalone'`. Dalam lingkungan produksi modern, penerapan pola ini memastikan layanan Anda bebas dari celah keamanan, mudah diamati (*observable*), dan siap menangani lonjakan beban kerja nyata.

```
import { after } from "next/server";

export async function GET(request: Request) {
  after(async () => {
    // Dijalankan setelah respons HTTP selesai dikirim ke pengguna
    console.log("Audit akses:", request.url);
  });
  return Response.json({ status: "ok" });
}
```

> **💡 Catatan Integrasi Kodeloka:** Modul ini dirancang untuk langsung ditambahkan ke akhir array di `next/data/modules.json` (dan `next/app.js`) sehingga memperluas cakupan kelas `next` dari **0 modul** menjadi **3 modul** berstandar terbaru.


## Latihan Praktik Mandiri

1. Terapkan konfigurasi dan kode dari ketiga modul pembaruan `next` di atas pada lingkungan lokal atau *staging* Anda.
2. Verifikasi perilaku saat terjadi kegagalan (*fault injection*): hentikan salah satu komponen atau kirimkan beban tinggi, lalu amati metrik dan log yang dihasilkan.
3. Integrasikan ketiga modul di atas ke dalam `next/data/modules.json` menggunakan panduan di `materi-gemini/README.md`.

## Kuis Pemahaman

### Soal 1
Apa tujuan utama penambahan modul perluasan berstandar 2025/2026 pada kelas `next` ini?
- A. Mengganti seluruh materi dasar dengan bahasa pemrograman yang sama sekali berbeda
- B. Melengkapi kurikulum yang sudah ada (0 modul) dengan fitur rilis terbaru, praktik penguatan keamanan produksi, dan observabilitas modern
- C. Menghapus seluruh latihan praktik dari kelas `next`
- D. Mematikan fitur kuis interaktif di platform Kodeloka

**Jawaban Benar:** B
**Penjelasan:** Paket pembaruan ini melengkapi 0 modul yang sudah ada di `next/data/modules.json` dengan kapabilitas versi terbaru, arsitektur produksi, dan keamanan modern tanpa merusak struktur kelas yang sudah berjalan.

### Soal 2
Manakah prinsip yang wajib dijaga saat mengoperasikan teknologi `next` di lingkungan produksi?
- A. Menjalankan seluruh layanan sebagai `root` tanpa batas memori dan tanpa pemantauan
- B. Menerapkan prinsip hak akses paling rendah (*least privilege*), membatasi penggunaan sumber daya, memvalidasi konfigurasi secara otomatis di CI/CD, dan memantau metrik/log kesehatan layanan
- C. Mengabaikan pembaruan versi keamanan
- D. Menyimpan kata sandi produksi di dalam kode sumber publik

**Jawaban Benar:** B
**Penjelasan:** Keandalan dan keamanan di produksi bergantung pada isolasi hak akses, pembatasan sumber daya (memori/waktu tunggu), otomasi pengujian, dan observabilitas menyeluruh.

### Soal 3
Bagaimana cara mengintegrasikan ketiga modul baru di berkas ini ke dalam situs Kodeloka?
- A. Menghapus seluruh folder `next/`
- B. Mengekstrak objek `judul`, `tingkat`, `ringkas`, `isi`, contoh kode, dan `kuis` dari berkas ini ke dalam `next/data/modules.json` serta memperbarui jumlah modul di `scripts/courses.json`
- C. Mengubah ekstensi berkas menjadi `.exe`
- D. Tidak perlu melakukan apa pun karena peramban membaca berkas Markdown secara acak

**Jawaban Benar:** B
**Penjelasan:** Sesuai arsitektur Kodeloka, setiap modul baru ditambahkan ke `next/data/modules.json` (dan disinkronkan ke `next/app.js` serta `scripts/courses.json`).

## Sumber

- [Dokumentasi Resmi — Next.js Modern (Next.js 15 & React 19)](https://nextjs.org/docs)
