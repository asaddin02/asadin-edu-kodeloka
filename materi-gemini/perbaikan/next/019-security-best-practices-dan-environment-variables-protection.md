# Perbaikan: Security Best Practices & Environment Variables Protection

- **Kelas:** next
- **Modul:** 19
- **Jenis:** pengganti

## Yang kurang
Materi saat ini hanya 61 kata. Belum membahas penggunaan paket `server-only` untuk mencegah modul rahasia terimpor ke *Client Component*, urutan prioritas berkas `.env*` di Next.js, Pola *Data Access Layer* (DAL) untuk otorisasi di *Server Components* dan *Server Actions*, serta validasi variabel lingkungan saat aplikasi dijalankan.

## Materi pengganti

### 1. Aturan Isolasi Variabel Lingkungan (`NEXT_PUBLIC_` vs Khusus Server)

Next.js memuat variabel lingkungan dari `.env.local`, `.env.development`, atau `.env.production` secara otomatis. Namun, ada batas keamanan tegas antara lingkungan server dan peramban:

- **Variabel tanpa awalan `NEXT_PUBLIC_` (mis. `DATABASE_URL`, `STRIPE_SECRET_KEY`, `JWT_SECRET`):** Hanya tersedia di lingkungan Node.js/Server. Jika diakses di *Client Component*, nilainya dievaluasi menjadi `undefined`.
- **Variabel berawalan `NEXT_PUBLIC_` (mis. `NEXT_PUBLIC_APP_URL`):** Nilainya **disematkan langsung (*inlined*) ke dalam berkas JavaScript publik** pada waktu *build* (`next build`). Jangan pernah menaruh kunci rahasia dengan awalan `NEXT_PUBLIC_`.

### 2. Mengunci Modul Server dengan Paket `server-only`

Seorang pengembang bisa saja tanpa sengaja mengimpor fungsi utilitas database ke dalam berkas yang memiliki `'use client'`. Untuk membuat proses *build* langsung gagal dengan pesan jelas apabila modul server diimpor oleh komponen klien, pasang penanda `import "server-only"`:

```ts
// lib/env.server.ts
import "server-only";
import { z } from "zod";

const serverEnvSchema = z.object({
  DATABASE_URL: z.string().url(),
  SESSION_SECRET: z.string().min(32),
  PAYMENT_WEBHOOK_SECRET: z.string().min(16),
});

// Gagal lebih awal (fail-fast) saat startup jika ada variabel yang hilang
export const serverEnv = serverEnvSchema.parse({
  DATABASE_URL: process.env.DATABASE_URL,
  SESSION_SECRET: process.env.SESSION_SECRET,
  PAYMENT_WEBHOOK_SECRET: process.env.PAYMENT_WEBHOOK_SECRET,
});
```

### 3. Mengamankan *Server Actions* dan *Data Access Layer* (DAL)

Setiap fungsi yang ditandai dengan `'use server'` pada dasarnya membuat **endpoint HTTP POST publik** yang dapat dipanggil langsung oleh siapa pun menggunakan `curl` atau skrip eksternal, bukan hanya lewat tombol di antarmuka React Anda. Oleh karena itu:

1. **Verifikasi sesi dan otorisasi di dalam setiap *Server Action*:** Jangan mengandalkan penyembunyian tombol di UI atau pengecekan di *layout* semata.
2. **Validasi seluruh argumen input dengan skema (mis. Zod):** Jangan percaya tipe TypeScript pada argumen fungsi `'use server'`, karena tipe TypeScript hilang saat waktu jalan (*runtime*).
3. **Kembalikan *Data Transfer Object* (DTO) yang sudah disaring:** Jangan meneruskan objek model ORM mentah dari *Server Component* ke *Client Component* melalui *props*.

| Celah Keamanan Umum di Next.js | Dampak | Solusi Produksi |
| :--- | :--- | :--- |
| Mengoper seluruh objek `user` dari Prisma ke `<ProfileClient user={user} />` | Seluruh field di objek diserialisasi ke payload RSC dan terlihat di tab Network DevTools | Buat fungsi DTO yang hanya memilih field publik (`id`, `name`, `avatarUrl`). |
| Mengasumsikan *Server Action* hanya bisa dipanggil oleh halaman yang menampilkannya | Penyerang dapat memanggil ID aksi secara langsung tanpa izin | Panggil fungsi `verifySession()` di baris pertama setiap *Server Action*. |

## Sumber
- [Next.js Documentation — Environment Variables Guide](https://nextjs.org/docs/app/guides/environment-variables)
- [Next.js Documentation — Data Security Guide (Server Components & Actions)](https://nextjs.org/docs/app/guides/data-security)
