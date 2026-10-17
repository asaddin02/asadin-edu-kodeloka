# Perbaikan: Styling dengan Tailwind CSS v4 & Shadcn UI

- **Kelas:** next
- **Modul:** 4
- **Jenis:** pengganti

## Yang kurang
Materi saat ini hanya 56 kata. Belum membahas perubahan arsitektur besar pada Tailwind CSS v4 (konfigurasi CSS-first dengan `@import "tailwindcss"` dan direktif `@theme` yang menggantikan `tailwind.config.js`), integrasi variabel warna OKLCH untuk tema terang/gelap di Shadcn UI, serta utilitas penggabungan kelas `cn()` (`clsx` + `tailwind-merge`).

## Materi pengganti

### 1. Arsitektur CSS-First pada Tailwind CSS v4

Pada Tailwind CSS v4 yang menjadi bawaan proyek Next.js 16, berkas konfigurasi JavaScript `tailwind.config.ts` tidak lagi diperlukan. Seluruh konfigurasi token desain—mulai dari jenis huruf, warna merek, hingga ukuran sudut melengkung—ditulis langsung di dalam `app/globals.css` menggunakan direktif `@theme`:

```css
/* app/globals.css */
@import "tailwindcss";

/* Mengaktifkan varian dark berbasis kelas (.dark) pada elemen leluhur */
@custom-variant dark (&:is(.dark *));

:root {
  --background: oklch(0.99 0.005 250);
  --foreground: oklch(0.18 0.02 250);
  --primary: oklch(0.55 0.21 255);
  --primary-foreground: oklch(0.99 0.005 250);
  --radius: 0.625rem;
}

.dark {
  --background: oklch(0.15 0.02 250);
  --foreground: oklch(0.96 0.01 250);
  --primary: oklch(0.68 0.19 255);
  --primary-foreground: oklch(0.15 0.02 250);
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --radius-lg: var(--radius);
  --font-sans: var(--font-geist-sans), system-ui, sans-serif;
}
```

Dengan `@theme inline`, setiap variabel `--color-*` otomatis menghasilkan kelas utilitas seperti `bg-primary`, `text-primary-foreground`, dan `border-primary` tanpa langkah kompilasi konfigurasi JavaScript.

### 2. Mengapa Shadcn UI Memakai Pola `cn()` (`clsx` + `tailwind-merge`)?

Komponen Shadcn UI disalin langsung ke folder `components/ui/` di repositori Anda sehingga Anda memegang kendali penuh atas kodenya. Agar komponen dapat menerima prop `className` dari luar tanpa menimbulkan bentrokan spesifisitas kelas Tailwind (misalnya `px-4` bawaan komponen bertabrakan dengan `px-8` dari pemanggil), selalu gunakan fungsi bantu `cn()`:

```tsx
// lib/utils.ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

| Pustaka | Peran dalam Fungsi `cn()` | Contoh Kasus |
| :--- | :--- | :--- |
| `clsx` | Menggabungkan kelas kondisional dan mengabaikan nilai `false`/`undefined` | `clsx("p-4", isActive && "bg-primary")` |
| `tailwind-merge` | Menghapus kelas utilitas Tailwind yang saling menimpa pada properti CSS yang sama | `twMerge("px-4 py-2", "px-8")` menghasilkan `"py-2 px-8"` |

## Sumber
- [Tailwind CSS v4.0 Official Documentation — Theme Variables (`@theme`)](https://tailwindcss.com/docs/theme)
- [Next.js Documentation — Tailwind CSS Guide](https://nextjs.org/docs/app/guides/tailwind-css)
- [shadcn/ui Documentation — Tailwind v4](https://ui.shadcn.com/docs/tailwind-v4)
