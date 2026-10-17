# Perbaikan: State Management & Advanced React 19 Hooks (useOptimistic, useActionState)

- **Kelas:** next
- **Modul:** 14
- **Jenis:** pengganti

## Yang kurang
Materi saat ini hanya 62 kata dan belum menyertakan penjelasan tanda tangan parameter maupun contoh cara kerja `useActionState`, `useOptimistic`, dan `useFormStatus` dari React 19 saat berinteraksi dengan *Server Actions* di Next.js 16.

## Materi pengganti

### 1. Mengelola Siklus Formulir Server Action dengan `useActionState`

Di React 19 dan Next.js 16, *hook* `useActionState` (diimpor dari `'react'`, menggantikan `useFormState` lama dari `'react-dom'`) menghubungkan *Server Action* dengan *state* komponen klien. Ia mengembalikan tupel tiga elemen: `[state, formAction, isPending]`:

```tsx
"use client";

import { useActionState } from "react";
import { daftarAcaraAction, type ActionState } from "./actions";

const initialState: ActionState = { ok: false, message: "" };

export function FormPendaftaranAcara({ eventId }: { eventId: string }) {
  const [state, formAction, isPending] = useActionState(
    daftarAcaraAction,
    initialState
  );

  return (
    <form action={formAction} className="space-y-3">
      <input type="hidden" name="eventId" value={eventId} />
      <label className="block">
        <span>Email Peserta</span>
        <input
          type="email"
          name="email"
          required
          disabled={isPending}
          className="border rounded px-3 py-2 w-full"
        />
      </label>

      {state.message && (
        <p
          role="status"
          className={state.ok ? "text-emerald-700" : "text-red-600"}
        >
          {state.message}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {isPending ? "Memproses pendaftaran..." : "Daftar Sekarang"}
      </button>
    </form>
  );
}
```

Perhatikan bahwa ketika fungsi *Server Action* dibungkus dengan `useActionState`, tanda tangan parameter pertamanya berubah menjadi `(prevState: ActionState, formData: FormData)`.

### 2. Pembaruan UI Seketika dengan `useOptimistic`

Untuk interaksi cepat seperti menekan tombol *Bookmark* atau *Upvote*, menunggu respons jaringan membuat antarmuka terasa lambat. `useOptimistic` menampilkan nilai sementara selama aksi asinkron sedang berlangsung, dan secara otomatis memulihkan (*rollback*) nilai asli apabila *Server Action* gagal:

```tsx
"use client";

import { useOptimistic, useTransition } from "react";
import { toggleBookmarkAction } from "./actions";

export function TombolBookmark({
  eventId,
  initialBookmarked,
  initialCount,
}: {
  eventId: string;
  initialBookmarked: boolean;
  initialCount: number;
}) {
  const [isPending, startTransition] = useTransition();
  const [optimistic, setOptimistic] = useOptimistic(
    { bookmarked: initialBookmarked, count: initialCount },
    (currentState, nextBookmarked: boolean) => ({
      bookmarked: nextBookmarked,
      count: currentState.count + (nextBookmarked ? 1 : -1),
    })
  );

  function handleClick() {
    const nextValue = !optimistic.bookmarked;
    startTransition(async () => {
      setOptimistic(nextValue);
      await toggleBookmarkAction(eventId, nextValue);
    });
  }

  return (
    <button type="button" onClick={handleClick} disabled={isPending}>
      {optimistic.bookmarked ? "★ Tersimpan" : "☆ Simpan"} ({optimistic.count})
    </button>
  );
}
```

### 3. Perbandingan Hook Form & Transisi di React 19

| Hook React 19 | Asal Paket | Kegunaan Utama |
| :--- | :--- | :--- |
| `useActionState(fn, initialState)` | `'react'` | Menangkap nilai kembalian validasi *Server Action* dan status `isPending` pada komponen induk `<form>`. |
| `useFormStatus()` | `'react-dom'` | Membaca status `pending` dari `<form>` induk di dalam komponen anak (misalnya komponen `<SubmitButton />` generik) tanpa *prop drilling*. |
| `useOptimistic(state, updateFn)` | `'react'` | Menampilkan proyeksi *state* baru secara instan sambil menunggu mutasi server selesai. |

## Sumber
- [React 19 Official Reference — `useActionState`](https://react.dev/reference/react/useActionState)
- [React 19 Official Reference — `useOptimistic`](https://react.dev/reference/react/useOptimistic)
- [Next.js Documentation — Updating Data (Server Actions and Mutations)](https://nextjs.org/docs/app/getting-started/updating-data)
