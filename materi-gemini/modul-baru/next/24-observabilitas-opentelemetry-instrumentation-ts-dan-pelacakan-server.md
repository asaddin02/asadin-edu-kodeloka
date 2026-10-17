# Observabilitas Produksi Next.js 16 dengan OpenTelemetry dan `instrumentation.ts`

- **Letak:** sesudah modul 21
- **Tingkat:** Lanjut
- **Ringkasan:** Mengaktifkan pelacakan terdistribusi (*distributed tracing*) dan penangkapan galat terpusat di Next.js 16 menggunakan konvensi berkas `instrumentation.ts`, fungsi `register()`, dan hook `onRequestError`.

## Mengapa Aplikasi Next.js Membutuhkan `instrumentation.ts`?

Saat aplikasi Next.js berjalan di produksi, permintaan pengguna melewati banyak tahapan di sisi server: *Middleware/Proxy*, *Server Components*, pemanggilan `fetch()` ke API eksternal, kueri basis data di dalam *Server Actions*, hingga *Route Handlers*. Jika sebuah halaman membutuhkan waktu 3 detik untuk dimuat, log konsol biasa tidak dapat menunjukkan tahapan mana yang menjadi sumber kemacetan.

Next.js menyediakan konvensi berkas **`instrumentation.ts`** (diletakkan di akar proyek atau di dalam folder `src/`, sejajar dengan folder `app/`). Berkas ini dijalankan satu kali saat instans server Next.js baru dinyalakan, menjadikannya tempat resmi untuk menginisialisasi SDK **OpenTelemetry** dan menangkap seluruh galat server melalui `onRequestError`.

## 1. Struktur Berkas `instrumentation.ts` dengan `@vercel/otel`

Cara paling ringkas untuk mengaktifkan OpenTelemetry di Next.js (baik saat di-deploy ke Vercel maupun di-host mandiri dengan Docker + OpenTelemetry Collector) adalah menggunakan paket `@vercel/otel` di dalam fungsi `register()`:

```ts
// instrumentation.ts
import { registerOTel } from "@vercel/otel";
import type { Instrumentation } from "next";

export function register() {
  registerOTel({
    serviceName: "kodeloka-web-app",
  });
}

// Hook resmi Next.js 15/16 untuk mencatat seluruh error tak tertangani di Server
export const onRequestError: Instrumentation.onRequestError = async (
  err,
  request,
  context
) => {
  console.error(
    JSON.stringify({
      level: "error",
      message: err.message,
      digest: err.digest,
      path: request.path,
      method: request.method,
      routerKind: context.routerKind, // 'Pages Router' | 'App Router'
      routePath: context.routePath,   // mis. '/events/[slug]'
      routeType: context.routeType,   // 'render' | 'route' | 'action' | 'middleware'
    })
  );
};
```

## 2. Membuat *Custom Span* untuk Mengukur Logika Bisnis di Server Action

Selain span otomatis yang dibuat oleh Next.js (untuk *render* halaman dan `fetch`), Anda dapat membuat *span* manual menggunakan `@opentelemetry/api` untuk mengukur durasi operasi spesifik seperti kueri database atau pembuatan PDF faktur:

```ts
// app/orders/actions.ts
"use server";

import { trace, SpanStatusCode } from "@opentelemetry/api";

const tracer = trace.getTracer("kodeloka-orders");

export async function prosesPesananAction(orderId: string) {
  return await tracer.startActiveSpan(
    "orders.prosesPesanan",
    async (span) => {
      try {
        span.setAttribute("order.id", orderId);
        // Simulasi verifikasi pembayaran dan pembaruan stok
        await new Promise((resolve) => setTimeout(resolve, 45));
        span.setStatus({ code: SpanStatusCode.OK });
        return { ok: true, orderId };
      } catch (error) {
        span.recordException(error as Error);
        span.setStatus({
          code: SpanStatusCode.ERROR,
          message: (error as Error).message,
        });
        throw error;
      } finally {
        span.end(); // Wajib selalu ditutup di blok finally!
      }
    }
  );
}
```

## 3. Ringkasan Konteks pada Hook `onRequestError`

| Properti `context` | Nilai yang Mungkin | Kegunaan Saat Investigasi Insiden |
| :--- | :--- | :--- |
| `routePath` | Pola rute berparameter (mis. `/kelas/[slug]`) | Mengelompokkan galat berdasarkan pola rute tanpa memicu ledakan kardinalitas URL |
| `routeType` | `'render'`, `'route'`, `'action'`, `'middleware'` | Membedakan apakah galat terjadi saat merender RSC, di API Route, atau di *Server Action* |
| `renderSource` | `'react-server-components'`, `'server-rendering'` | Mengetahui sumber eksekusi komponen saat galat muncul |

## Kuis Pemahaman

### Soal 1
Di manakah berkas `instrumentation.ts` harus ditempatkan agar dikenali oleh Next.js?
- A. Di dalam folder `app/api/instrumentation.ts`.
- B. Di dalam folder `public/instrumentation.ts`.
- C. Di akar proyek (atau di dalam folder `src/` jika proyek memakai `src/`), bukan di dalam folder `app/`.
- D. Di dalam folder `node_modules/.next/`.

**Jawaban Benar:** C
**Penjelasan:** Menurut dokumentasi resmi Next.js, `instrumentation.ts` wajib diletakkan di direktori akar proyek (atau tepat di dalam `src/` apabila proyek menggunakan struktur `src/app`), bukan di dalam direktori `app/`.

### Soal 2
Apa fungsi dari ekspor `onRequestError` di dalam `instrumentation.ts` pada Next.js 15/16?
- A. Mengganti tampilan halaman `error.tsx` di sisi peramban.
- B. Menangkap dan melaporkan setiap galat server yang terjadi pada *App Router* (*render*, *Server Action*, *Route Handler*, maupun *Middleware*) lengkap dengan metadata konteks rutenya.
- C. Mematikan server Node.js secara otomatis setiap kali terjadi HTTP `404`.
- D. Menghapus cache peramban pengguna secara jarak jauh.

**Jawaban Benar:** B
**Penjelasan:** Hook `onRequestError` dipanggil oleh server Next.js setiap kali terjadi galat dalam pemrosesan permintaan, menyediakan parameter `(err, request, context)` untuk dikirim ke sistem observabilitas terpusat.

### Soal 3
Mengapa panggilan `span.end()` pada pelacakan manual OpenTelemetry harus selalu diletakkan di dalam blok `finally`?
- A. Agar *span* tetap ditutup dan dikirim ke *collector* meskipun fungsi di dalam blok `try` melempar *exception*.
- B. Karena sintaks TypeScript mewajibkan setiap fungsi `async` memiliki blok `finally`.
- C. Untuk menghapus seluruh atribut yang sudah ditambahkan ke *span*.
- D. Agar *Server Action* dapat dijalankan di peramban tanpa koneksi internet.

**Jawaban Benar:** A
**Penjelasan:** Sebuah *span* yang tidak pernah dipanggil `.end()` tidak akan selesai dicatat dan dapat menyebabkan kebocoran memori serta hilangnya jejak justru pada saat terjadi kegagalan (*exception*).

## Sumber
- [Next.js Documentation — Instrumentation (`instrumentation.ts`, `register`, `onRequestError`)](https://nextjs.org/docs/app/api-reference/file-conventions/instrumentation)
- [Next.js Documentation — OpenTelemetry Guide](https://nextjs.org/docs/app/guides/open-telemetry)
