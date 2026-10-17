# Perbaikan: Data Fetching & Caching Strategy di Next.js 16

- **Kelas:** next
- **Modul:** 9
- **Jenis:** koreksi, tambahan

## Yang kurang
Materi saat ini hanya 103 kata dan memuat kesalahan faktual krusial: tertulis bahwa `fetch(url, { cache: 'force-cache' }) : Static Data Cache permanen (default)`. Sejak Next.js 15 dan dilanjutkan di Next.js 16, panggilan `fetch()` **tidak lagi di-cache secara bawaan (*uncached by default*)**. Selain itu, materi belum menjelaskan pengambilan data paralel dengan `Promise.all` dan pencegahan *request waterfall*.

## Koreksi
> Teks lama: "fetch(url, { cache: 'force-cache' }) : Static Data Cache permanen (default)."

Teks baru: "`fetch(url)` tanpa opsi `cache` secara bawaan **tidak menyimpan hasil ke Data Cache** (*uncached by default* sejak Next.js 15/16); tambahkan `{ cache: 'force-cache' }` atau gunakan direktif `'use cache'` bila Anda ingin menyimpan respons secara eksplisit."

## Materi tambahan
Letakkan di akhir materi (setelah daftar "Pilihan Opsi Fetch").

### 1. Perbandingan Perilaku *Data Fetching* di Next.js 16

| Strategi Pengambilan Data | Sintaks / Konfigurasi | Perilaku di Produksi |
| :--- | :--- | :--- |
| Dinamis per *request* (Bawaan `fetch`) | `await fetch('https://api.example.com/stok')` | Mengambil data segar pada setiap permintaan pengguna; masih di-*deduplicate* dalam satu *render pass* yang sama (*Request Memoization*). |
| Di-cache secara eksplisit | `await fetch(url, { cache: 'force-cache' })` | Menyimpan hasil di *Data Cache* hingga diinvalidasi secara manual. |
| Revalidasi berbasis waktu (*ISR*) | `await fetch(url, { next: { revalidate: 300 } })` | Menyajikan data cache selama 5 menit, lalu memperbaruinya di latar belakang (*stale-while-revalidate*). |
| Komponen atau fungsi ter-cache (Next.js 16) | Direktif `'use cache'` + `cacheLife('hours')` | Meng-cache hasil komponen RSC atau fungsi kueri database langsung (seperti Prisma/Drizzle) tanpa harus membungkusnya dalam `fetch()`. |

### 2. Mencegah *Request Waterfall* dengan Pengambilan Paralel

Kesalahan performa paling umum di *Server Components* adalah menulis beberapa `await` secara berurutan padahal kueri kedua tidak bergantung pada hasil kueri pertama:

```tsx
// app/events/[slug]/page.tsx
interface EventPageProps {
  params: Promise<{ slug: string }>;
}

export default async function EventDetailPage({ params }: EventPageProps) {
  // Di Next.js 15/16, params wajib di-await terlebih dahulu
  const { slug } = await params;

  // JANGAN berurutan jika keduanya independen.
  // Jalankan secara paralel dengan Promise.all:
  const [eventRes, speakersRes] = await Promise.all([
    fetch(`https://api.example.com/events/${slug}`, {
      next: { revalidate: 600, tags: [`event-${slug}`] },
    }),
    fetch(`https://api.example.com/events/${slug}/speakers`, {
      next: { revalidate: 600, tags: [`event-${slug}`] },
    }),
  ]);

  if (!eventRes.ok) {
    throw new Error("Gagal memuat detail acara");
  }

  const [event, speakers] = await Promise.all([
    eventRes.json(),
    speakersRes.json(),
  ]);

  return (
    <main>
      <h1>{event.title}</h1>
      <p>Jumlah pembicara: {speakers.length}</p>
    </main>
  );
}
```

## Sumber
- [Next.js Documentation — Fetching Data](https://nextjs.org/docs/app/getting-started/fetching-data)
- [Next.js Documentation — Caching and Revalidating](https://nextjs.org/docs/app/getting-started/caching-and-revalidating)
- [Next.js Documentation — Upgrading to Version 15 & 16 Caching Changes](https://nextjs.org/docs/app/guides/upgrading/version-15)
