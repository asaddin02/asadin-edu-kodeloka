/* Next.js 16 Interactive Learning & Certification Platform Engine */

const modulesData = [
  {
    "id": 1,
    "title": "01. Pengenalan Next.js 16 & Ecosystem Overview",
    "category": "Dasar",
    "videoId": "I1V9YWqRIeI",
    "duration": "18:45",
    "description": "Memahami evolusi Next.js 16, integrasi React 19, Turbopack Bundler, App Router vs Pages Router, dan arsitektur Full-Stack modern.",
    "keyTakeaways": [
      "Arsitektur hybrid Next.js 16: Server Rendering (SSR), Static Site Generation (SSG), & Client Side Rendering (CSR)",
      "Integrasi React 19 (Server Components, Actions, use Optimistic Hooks)",
      "Peningkatan kecepatan build & dev server dengan Turbopack Engine"
    ],
    "fullArticle": `
            <div class="article-section">
                <h3>📌 Mengapa Next.js 16 Menjadi standar Framework Full-Stack?</h3>
                <p><strong>Next.js 16</strong> adalah iterasi terbaru dari framework React buatan Vercel yang dirancang khusus untuk membangun aplikasi web modern berskala enterprise. Di versi 16, fokus utama terletak pada <strong>performa kompilasi ultra-cepat dengan Turbopack</strong>, model caching yang lebih eksplisit dan terprediksi, serta dukungan native untuk fitur-fitur <strong>React 19</strong>.</p>
                <div class="callout callout-info">
                    <strong>Fitur Unggulan Next.js 16:</strong>
                    <ul>
                        <li><strong>React Server Components (RSC):</strong> Komponen React yang di-render 100% di server tanpa menambah ukuran JavaScript bundle di browser client.</li>
                        <li><strong>Turbopack Dev Engine:</strong> Pengganti Webpack berbasis Rust yang memberikan waktu HMR (Hot Module Replacement) hingga 10x lebih cepat.</li>
                        <li><strong>Explicit Caching Controls:</strong> Kontrol caching transparan menghindari bug data usang (stale data).</li>
                        <li><strong>Server Actions:</strong> Mengeksekusi mutasi data server langsung dari form React tanpa perlu menulis boilerplate API endpoint.</li>
                    </ul>
                </div>
            </div>

            <div class="article-section">
                <h3>⚙️ Perbandingan App Router vs Legacy Pages Router</h3>
                <p>Sejak Next.js 13+, Vercel memperkenalkan <strong>App Router</strong> (direktori <code>app/</code>) yang menggantikan Pages Router konvensional (direktori <code>pages/</code>).</p>
                <ul>
                    <li><strong>Pages Router:</strong> Menggunakan struktur file sederhana berbasis path, namun seluruh komponen secara default di-bundle untuk client. State management & data fetching dilakukan via <code>getServerSideProps</code> atau <code>getStaticProps</code>.</li>
                    <li><strong>App Router (Next.js 16):</strong> Menggunakan arsitektur berbasis folder & file spesial (<code>page.tsx</code>, <code>layout.tsx</code>, <code>loading.tsx</code>). Secara default SELURUH komponen adalah Server Component.</li>
                </ul>
            </div>

            <div class="article-section">
                <h3>💻 Contoh Struktur Aplikasi Next.js 16</h3>
                <div class="code-container">
                    <div class="code-header"><span>app/page.tsx</span><button class="copy-btn" onclick="copyCode(this)">Copy</button></div>
                    <pre><code>// Next.js 16 React Server Component (RSC)
export default async function HomePage() {
  // Fetching data langsung di dalam Server Component tanpa useEffect!
  const res = await fetch("https://api.github.com/repos/vercel/next.js");
  const repo = await res.json();

  return (
    &lt;main class="p-8 font-sans"&gt;
      &lt;h1 class="text-3xl font-bold"&gt;Welcome to Next.js 16!🚀&lt;/h1&gt;
      &lt;p class="mt-2 text-gray-400"&gt;GitHub Stars: {repo.stargazers_count}&lt;/p&gt;
    &lt;/main&gt;
  );
}</code></pre>
                </div>
            </div>
    `,
    "codeSnippets": [
      {
        "lang": "tsx",
        "title": "HomePage Server Component",
        "code": "export default async function HomePage() {\n  const res = await fetch('https://api.github.com/repos/vercel/next.js');\n  const data = await res.json();\n  return <div>Next.js Stars: {data.stargazers_count}</div>;\n}"
      }
    ],
    "interactiveLab": `export default async function Page() {
  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1 style={{ color: '#0070f3' }}>🚀 Modul 1: Next.js 16 App Router</h1>
      <p>Ini adalah React Server Component yang berjalan secara otomatis di Server!</p>
      <div style={{ background: '#1c1c1c', padding: '12px', borderRadius: '8px', marginTop: '10px' }}>
        Status Turbopack: Active (Fast HMR)
      </div>
    </div>
  );
}`,
    "quiz": [
      {
        "question": "Apakah jenis komponen default saat Anda membuat file di dalam direktori app/ pada Next.js 16?",
        "options": [
          "Client Component",
          "React Server Component (RSC)",
          "Class Component",
          "Redux Connected Component"
        ],
        "answer": 1,
        "explanation": "Secara default, seluruh komponen yang dibuat di direktori app/ pada Next.js 16 adalah React Server Component (RSC) kecuali Anda menambahkan direktif 'use client'."
      },
      {
        "question": "Engine bundler apakah yang digunakan oleh Next.js 16 untuk kompilasi super cepat berbasis Rust?",
        "options": [
          "Webpack 5",
          "Babel",
          "Turbopack",
          "Rollup"
        ],
        "answer": 2,
        "explanation": "Turbopack adalah bundler generasi terbaru buatan Vercel berbasis Rust yang menggantikan Webpack di Next.js."
      }
    ]
  },
  {
    "id": 2,
    "title": "02. Inisialisasi Proyek & Struktur Direktori App Router",
    "category": "Dasar",
    "videoId": "I1V9YWqRIeI",
    "duration": "22:10",
    "description": "Langkah demi langkah membuat proyek Next.js 16 dengan TypeScript, Tailwind CSS v4, ESLint, dan memahami struktur folder app/.",
    "keyTakeaways": [
      "Inisialisasi CLI `npx create-next-app@latest` dengan konfigurasi TypeScript & Tailwind",
      "Peran penting direktori `public/`, `app/`, `components/`, dan `lib/`",
      "Mengenal konvensi file bawaan: `layout.tsx`, `page.tsx`, `globals.css`"
    ],
    "fullArticle": `
            <div class="article-section">
                <h3>🚀 Langkah Memulai Proyek Baru Next.js 16</h3>
                <p>Untuk membuat proyek Next.js 16 baru dari terminal, kita menggunakan utilitas CLI resmi <code>create-next-app</code>:</p>
                <div class="code-container">
                    <div class="code-header"><span>Bash Terminal</span><button class="copy-btn" onclick="copyCode(this)">Copy</button></div>
                    <pre><code>npx create-next-app@latest dev-event-platform --typescript --tailwind --eslint --app --src-dir=false --import-alias="@/*"</code></pre>
                </div>
            </div>

            <div class="article-section">
                <h3>📁 Anatomi Struktur Direktori Next.js 16</h3>
                <p>Setelah instalasi selesai, berikut adalah pohon direktori standar yang disarankan:</p>
                <ul>
                    <li><code>app/</code>: Berisi seluruh route, layout, dan file routing Next.js 16.</li>
                    <li><code>app/layout.tsx</code>: Root Layout yang membungkus seluruh halaman aplikasi (HTML shell & Google Fonts).</li>
                    <li><code>app/page.tsx</code>: Tampilan utama untuk URL index root (<code>/</code>).</li>
                    <li><code>app/globals.css</code>: Konfigurasi Tailwind CSS v4 dan global CSS variables.</li>
                    <li><code>components/</code>: Tempat menyimpan komponen UI yang reusable (Button, Navbar, Modal).</li>
                    <li><code>lib/</code>: File helper, integrasi database (Prisma client, Supabase, utilities).</li>
                    <li><code>public/</code>: Asset statis seperti logo gambar (<code>.png</code>, <code>.svg</code>, <code>favicon.ico</code>).</li>
                </ul>
            </div>
    `,
    "codeSnippets": [
      {
        "lang": "bash",
        "title": "Create Next App Command",
        "code": "npx create-next-app@latest my-app --typescript --tailwind --eslint --app"
      }
    ],
    "interactiveLab": `export default function Page() {
  return (
    <div style={{ fontFamily: 'monospace', padding: '15px' }}>
      <h3>📁 Structure Tree Simulator:</h3>
      <ul>
        <li>my-next-app/</li>
        <li>├── app/</li>
        <li>│   ├── layout.tsx (Root Shell)</li>
        <li>│   ├── page.tsx (Home View)</li>
        <li>│   └── globals.css</li>
        <li>├── components/</li>
        <li>└── public/</li>
      </ul>
    </div>
  );
}`,
    "quiz": [
      {
        "question": "File manakah yang bertindak sebagai Root Layout utama tempat tag <html> dan <body> didefinisikan?",
        "options": [
          "app/page.tsx",
          "app/layout.tsx",
          "app/index.tsx",
          "app/template.tsx"
        ],
        "answer": 1,
        "explanation": "app/layout.tsx adalah Root Layout wajib di Next.js App Router yang mendefinisikan struktur <html> dan <body>."
      }
    ]
  },
  {
    "id": 3,
    "title": "03. Server Components vs Client Components di Next.js 16",
    "category": "Dasar",
    "videoId": "I1V9YWqRIeI",
    "duration": "25:30",
    "description": "Memahami batasan (serialization boundaries), interaktivitas event listener, dan kapan harus menggunakan 'use client'.",
    "keyTakeaways": [
      "Secara default seluruh komponen adalah React Server Components (RSC)",
      "Gunakan direktif `'use client'` hanya untuk komponen yang butuh State (useState), Effects (useEffect), atau Event Handlers (onClick)",
      "Best practice memisahkan Client Boundaries agar bundle JavaScript tetap kecil"
    ],
    "fullArticle": `
            <div class="article-section">
                <h3>⚖️ Perbandingan Server Components vs Client Components</h3>
                <table style="width:100%; border-collapse: collapse; margin-top:10px; font-size:0.9rem;">
                    <thead>
                        <tr style="border-bottom:2px solid var(--next-border); text-align:left;">
                            <th style="padding:8px;">Fitur / Kebutuhan</th>
                            <th style="padding:8px; color:var(--next-blue);">Server Component (Default)</th>
                            <th style="padding:8px; color:var(--next-cyan);">Client Component ('use client')</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr style="border-bottom:1px solid var(--next-border);">
                            <td style="padding:8px;">Fetch Data Database/API</td>
                            <td style="padding:8px;">✅ Direct (Kecepatan Tinggi)</td>
                            <td style="padding:8px;">⚠️ Membutuhkan API Endpoint / SWR</td>
                        </tr>
                        <tr style="border-bottom:1px solid var(--next-border);">
                            <td style="padding:8px;">Akses Rahasia (API Keys/ENV)</td>
                            <td style="padding:8px;">✅ Aman di Server</td>
                            <td style="padding:8px;">❌ Berbahaya (Terekspos ke Browser)</td>
                        </tr>
                        <tr style="border-bottom:1px solid var(--next-border);">
                            <td style="padding:8px;">Interaktivitas (onClick, onChange)</td>
                            <td style="padding:8px;">❌ Tidak Bisa</td>
                            <td style="padding:8px;">✅ Bawaan Browser</td>
                        </tr>
                        <tr style="border-bottom:1px solid var(--next-border);">
                            <td style="padding:8px;">React State (useState, useEffect)</td>
                            <td style="padding:8px;">❌ Tidak Ada State</td>
                            <td style="padding:8px;">✅ Penuh Support</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div class="article-section">
                <h3>💡 Contoh Penggunaan Direktif 'use client'</h3>
                <div class="code-container">
                    <div class="code-header"><span>components/CounterButton.tsx</span><button class="copy-btn" onclick="copyCode(this)">Copy</button></div>
                    <pre><code>"use client"; // Wajib ditambahkan di baris paling atas file!

import { useState } from "react";

export default function CounterButton() {
  const [count, setCount] = useState(0);

  return (
    &lt;button 
      onClick={() =&gt; setCount(count + 1)}
      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
    &gt;
      Clicked {count} times
    &lt;/button&gt;
  );
}</code></pre>
                </div>
            </div>
    `,
    "codeSnippets": [
      {
        "lang": "tsx",
        "title": "Client Component Example",
        "code": "\"use client\";\nimport { useState } from 'react';\nexport function LikeButton() {\n  const [likes, setLikes] = useState(0);\n  return <button onClick={() => setLikes(likes + 1)}>Likes: {likes}</button>;\n}"
      }
    ],
    "interactiveLab": `"use client";
// Simulasi Client Component Interaktif
export default function Page() {
  const handleClick = () => {
    alert("Tombol di-klik di Client Component!");
  };
  return (
    <div style={{ padding: '15px' }}>
      <button onClick={handleClick} style={{ padding: '8px 16px', background: '#0070f3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
        Klik Saya (Client Event)
      </button>
    </div>
  );
}`,
    "quiz": [
      {
        "question": "Di manakah posisi meletakkan string direktif 'use client'?",
        "options": [
          "Di dalam fungsi return JSX",
          "Di baris paling atas (line 1) file sebelum import",
          "Di file package.json",
          "Di dalam file next.config.ts"
        ],
        "answer": 1,
        "explanation": "Direktif 'use client' harus diletakkan di baris paling awal file JavaScript/TypeScript sebelum perintah import."
      }
    ]
  },
  {
    "id": 4,
    "title": "04. Styling dengan Tailwind CSS v4 & Shadcn UI",
    "category": "Dasar",
    "videoId": "I1V9YWqRIeI",
    "duration": "21:40",
    "description": "Mengatur styling modern dengan Tailwind CSS v4, CSS Variables, Dark Mode toggle, dan komponen Shadcn UI.",
    "keyTakeaways": [
      "Tailwind v4 menggunakan konfigurasi berbasis CSS `@theme` di `globals.css`",
      "Shadcn UI menyediakan komponen ter-copy paste berbasis Radix Primitives & Tailwind",
      "Mendukung Dark Mode native dengan kelas `dark:`"
    ],
    "fullArticle": `
            <div class="article-section">
                <h3>🎨 Integrasi Design System Modern</h3>
                <p>Kombinasi <strong>Tailwind CSS v4</strong> dan <strong>Shadcn UI</strong> adalah standar industri terpopuler untuk membangun antarmuka web yang fleksibel, cepat, dan berestetika tinggi.</p>
            </div>
    `,
    "codeSnippets": [
      {
        "lang": "css",
        "title": "Tailwind v4 Import",
        "code": "@import \"tailwindcss\";\n@theme {\n  --color-brand: #0070f3;\n}"
      }
    ],
    "interactiveLab": `export default function Page() {
  return (
    <div style={{ padding: '15px' }}>
      <button style={{ background: '#0070f3', color: 'white', border: 'none', padding: '10px 18px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
        Shadcn UI Button Component
      </button>
    </div>
  );
}`,
    "quiz": [
      {
        "question": "Bagaimanakah prinsip utama komponen dari Shadcn UI jika dibandingkan dengan library UI tradisional seperti MUI/Chakra?",
        "options": [
          "Diinstall sebagai NPM package terdistribusi tertutup",
          "Komponen di-copy paste langsung ke dalam source code proyek Anda sehingga 100% dapat dikustomisasi",
          "Tidak bisa diubah styling-nya sama sekali",
          "Hanya mendukung Vue.js"
        ],
        "answer": 1,
        "explanation": "Shadcn UI menyalin langsung kode sumber komponen ke dalam folder komponen proyek Anda sehingga memiliki kontrol penuh atas styling."
      }
    ]
  },
  {
    "id": 5,
    "title": "05. File-Based Routing: Static, Dynamic & Catch-All Routes",
    "category": "Routing & Layout",
    "videoId": "I1V9YWqRIeI",
    "duration": "28:15",
    "description": "Menguasai pemetaan folder menjadi URL path, Dynamic Routes [id], Catch-all [...slug], dan Route Groups (auth).",
    "keyTakeaways": [
      "Struktur folder di app/ menentukan URL endpoint secara otomatis",
      "Dynamic Route dengan kurung siku `[id]` untuk parameter dinamis",
      "Route Groups `(groupName)` mengelompokkan file tanpa menambah segment URL"
    ],
    "fullArticle": `
            <div class="article-section">
                <h3>🗺️ Konsep File-Based Routing App Router</h3>
                <p>Setiap folder di dalam <code>app/</code> mewakili segmen URL. File <code>page.tsx</code> membuat segmen tersebut dapat diakses secara publik.</p>
                <ul>
                    <li><code>app/about/page.tsx</code> ➔ URL: <code>/about</code></li>
                    <li><code>app/events/[id]/page.tsx</code> ➔ URL: <code>/events/123</code> (Dynamic Parameter)</li>
                    <li><code>app/blog/[...slug]/page.tsx</code> ➔ URL: <code>/blog/2026/07/nextjs-16</code> (Catch-all Route)</li>
                    <li><code>app/(auth)/login/page.tsx</code> ➔ URL: <code>/login</code> (Route Group mengabaikan folder <code>(auth)</code>)</li>
                </ul>
            </div>

            <div class="article-section">
                <h3>💻 Mengakses Dynamic Route Parameters</h3>
                <div class="code-container">
                    <div class="code-header"><span>app/events/[id]/page.tsx</span><button class="copy-btn" onclick="copyCode(this)">Copy</button></div>
                    <pre><code>interface PageProps {
  params: Promise&lt;{ id: string }&gt;;
}

export default async function EventDetailPage({ params }: PageProps) {
  // Di Next.js 16, params adalah Promise yang harus di-await!
  const { id } = await params;

  return (
    &lt;div className="p-6"&gt;
      &lt;h1 className="text-2xl font-bold"&gt;Detail Event ID: {id}&lt;/h1&gt;
    &lt;/div&gt;
  );
}</code></pre>
                </div>
            </div>
    `,
    "codeSnippets": [
      {
        "lang": "tsx",
        "title": "Dynamic Params Handling",
        "code": "export default async function EventPage({ params }: { params: Promise<{ id: string }> }) {\n  const { id } = await params;\n  return <div>Event ID: {id}</div>;\n}"
      }
    ],
    "interactiveLab": `export default async function Page() {
  // Simulasi Dynamic Route /events/ev-1001
  const params = { id: 'ev-1001' };
  return (
    <div style={{ padding: '15px' }}>
      <h2>📅 Dynamic Route Preview</h2>
      <p>Param ID: <strong style={{ color: '#00dfd8' }}>{params.id}</strong></p>
      <p>Mapped Path: <code>/events/{params.id}</code></p>
    </div>
  );
}`,
    "quiz": [
      {
        "question": "Bagaimana cara membuat Route Group yang mengelompokkan folder tanpa mempengaruhi URL path?",
        "options": [
          "Membungkus nama folder dengan kurung siku [folder]",
          "Membungkus nama folder dengan kurung biasa (folder)",
          "Menambahkan titik dua di awal nama :folder",
          "Menambahkan underscore _folder"
        ],
        "answer": 1,
        "explanation": "Route Groups menggunakan tanda kurung biasa seperti (auth) sehingga tidak menambah segmen pada URL path."
      }
    ]
  },
  {
    "id": 6,
    "title": "06. Layouts, Templates, & Component Composition",
    "category": "Routing & Layout",
    "videoId": "I1V9YWqRIeI",
    "duration": "24:00",
    "description": "Membuat nested layouts, memahami perbedaan state preservation pada Layout vs re-rendering pada Template.",
    "keyTakeaways": [
      "Layout (`layout.tsx`) mempertahankan state komponen & scroll position saat berpindah route anak",
      "Template (`template.tsx`) menciptakan instance baru & re-mount komponen di setiap navigasi",
      "Nested Layouts memungkinkan pembagian struktur UI hierarkis (Dashboard Sidebar, Settings Tab)"
    ],
    "fullArticle": `
            <div class="article-section">
                <h3>🏛️ Konsep Layout vs Template</h3>
                <p>Dalam App Router, kita dapat menyusun UI secara hierarkis menggunakan <strong>Nested Layouts</strong>.</p>
                <div class="callout callout-tip">
                    <strong>Perbedaan Kunci:</strong>
                    <ul>
                        <li><strong>layout.tsx:</strong> Tidak mengalami re-render saat navigasi antar child route. Sangat cocok untuk Sidebar, Header, Footer.</li>
                        <li><strong>template.tsx:</strong> Mengalami re-creation DOM & reset state setiap kali route berubah. Cocok untuk animasi CSS entry/exit (Page Transitions) atau tracking analytics per halaman.</li>
                    </ul>
                </div>
            </div>

            <div class="article-section">
                <h3>💻 Kode Contoh Nested Dashboard Layout</h3>
                <div class="code-container">
                    <div class="code-header"><span>app/dashboard/layout.tsx</span><button class="copy-btn" onclick="copyCode(this)">Copy</button></div>
                    <pre><code>import Sidebar from "@/components/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    &lt;div className="flex min-h-screen"&gt;
      &lt;Sidebar /&gt;
      &lt;main className="flex-1 p-8"&gt;{children}&lt;/main&gt;
    &lt;/div&gt;
  );
}</code></pre>
                </div>
            </div>
    `,
    "codeSnippets": [
      {
        "lang": "tsx",
        "title": "Dashboard Layout Template",
        "code": "export default function Layout({ children }: { children: React.ReactNode }) {\n  return (\n    <div style={{ display: 'flex' }}>\n      <aside>Sidebar</aside>\n      <main>{children}</main>\n    </div>\n  );\n}"
      }
    ],
    "interactiveLab": `export default function DashboardLayout() {
  return (
    <div style={{ display: 'flex', gap: '15px', padding: '15px', border: '1px solid #333' }}>
      <aside style={{ width: '120px', background: '#222', padding: '10px' }}>
        📌 Sidebar Layout (Persisted)
      </aside>
      <main style={{ flex: 1, background: '#111', padding: '10px' }}>
        📄 Dashboard Main Content ({children || "Child Page View"})
      </main>
    </div>
  );
}`,
    "quiz": [
      {
        "question": "Apakah yang terjadi pada State di dalam layout.tsx ketika pengguna berpindah antar sub-route di dalam layout tersebut?",
        "options": [
          "State akan selalu di-reset ke nilai awal",
          "State tetap dipertahankan (persisted) tanpa re-mount",
          "Aplikasi akan melempar Error 500",
          "Page dipaksa reload penuh"
        ],
        "answer": 1,
        "explanation": "Layout.tsx mempertahankan state dan tidak mengalami re-mount saat navigasi antar child route."
      }
    ]
  },
  {
    "id": 7,
    "title": "07. Special Files: loading.tsx, error.tsx, & not-found.tsx",
    "category": "Routing & Layout",
    "videoId": "I1V9YWqRIeI",
    "duration": "20:45",
    "description": "Mengatasi UI asynchronous dengan React Suspense via loading.tsx, Error Boundaries via error.tsx, serta Halaman 404.",
    "keyTakeaways": [
      "`loading.tsx` secara otomatis membungkus Halaman dengan React Suspense boundary",
      "`error.tsx` bertindak sebagai Error Boundary (wajib Client Component `'use client'`)",
      "`not-found.tsx` menampilkan halaman 404 kustom dan bisa dipicu via fungsi `notFound()`"
    ],
    "fullArticle": `
            <div class="article-section">
                <h3>⚡ Konvensi File Spesial UI Next.js 16</h3>
                <p>Next.js menyediakan berkas deklaratif untuk menangani status loading & error tanpa mengotori logika komponen utama:</p>
                <ul>
                    <li><code>loading.tsx</code>: Menampilkan Skeleton UI atau Spinner secara instan saat data server sedang di-fetch.</li>
                    <li><code>error.tsx</code>: Menangkap runtime error pada child component & menyediakan tombol recovery "Try Again".</li>
                    <li><code>not-found.tsx</code>: Tampilan khusus jika resource tidak ditemukan.</li>
                </ul>
            </div>

            <div class="article-section">
                <h3>💻 Contoh error.tsx Boundary</h3>
                <div class="code-container">
                    <div class="code-header"><span>app/events/error.tsx</span><button class="copy-btn" onclick="copyCode(this)">Copy</button></div>
                    <pre><code>"use client"; // Error boundary WAJIB berupa Client Component

import { useEffect } from "react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Caught error:", error);
  }, [error]);

  return (
    &lt;div className="p-8 text-center"&gt;
      &lt;h2 className="text-xl font-bold text-red-500"&gt;Terjadi Kesalahan System!&lt;/h2&gt;
      &lt;button 
        onClick={() =&gt; reset()}
        className="mt-4 bg-gray-800 text-white px-4 py-2 rounded-md"
      &gt;
        Coba Lagi 🔄
      &lt;/button&gt;
    &lt;/div&gt;
  );
}</code></pre>
                </div>
            </div>
    `,
    "codeSnippets": [
      {
        "lang": "tsx",
        "title": "Instant Loading Skeleton",
        "code": "export default function Loading() {\n  return <div className=\"animate-pulse text-blue-400\">Loading Events Data...</div>;\n}"
      }
    ],
    "interactiveLab": `export default function Page() {
  return (
    <div style={{ padding: '15px' }}>
      <div style={{ padding: '10px', background: 'rgba(255,0,0,0.1)', borderLeft: '4px solid red' }}>
        ⚠️ Simulated Error Boundary (error.tsx)
      </div>
      <p style={{ marginTop: '10px' }}>Loading Skeleton (loading.tsx) di-render otomatis oleh React Suspense.</p>
    </div>
  );
}`,
    "quiz": [
      {
        "question": "Mengapa file error.tsx WAJIB memiliki direktif 'use client'?",
        "options": [
          "Karena error.tsx hanya bisa berjalan di Node.js",
          "Karena React Error Boundaries membutuhkan metode lifecycle / event handler client untuk pemulihan (reset)",
          "Agar ukuran file menjadi lebih kecil",
          "Agar bisa memanggil database secara langsung"
        ],
        "answer": 1,
        "explanation": "React Error Boundaries harus berupa Client Component agar dapat menangani pemulihan state di browser."
      }
    ]
  },
  {
    "id": 8,
    "title": "08. Metadata API, OpenGraph & Dynamic SEO",
    "category": "Routing & Layout",
    "videoId": "I1V9YWqRIeI",
    "duration": "19:20",
    "description": "Mengonfigurasi SEO, tag meta title, meta description, favicon, dan OpenGraph sosial media secara statis & dinamis.",
    "keyTakeaways": [
      "Objek `export const metadata` untuk halaman statis",
      "Fungsi `generateMetadata()` untuk mengambil metadata dinamis berbasis database/params",
      "Dukungan otomatis sitemap.xml, robots.txt, dan image OpenGraph"
    ],
    "fullArticle": `
            <div class="article-section">
                <h3>🔍 Pengelolaan Metadata API di Next.js 16</h3>
                <p>Next.js 16 menyediakan API Metadata deklaratif yang kuat untuk memaksimalkan peringkat SEO Google & tampilan preview link WhatsApp/Twitter/Facebook.</p>
            </div>

            <div class="article-section">
                <h3>💻 Metadata Statis vs Dinamis</h3>
                <div class="code-container">
                    <div class="code-header"><span>app/events/[id]/page.tsx</span><button class="copy-btn" onclick="copyCode(this)">Copy</button></div>
                    <pre><code>import { Metadata } from "next";

type Props = {
  params: Promise&lt;{ id: string }&gt;;
};

// Generasi SEO Meta secara Dinamis
export async function generateMetadata({ params }: Props): Promise&lt;Metadata&gt; {
  const { id } = await params;
  const event = await fetch(\`https://api.example.com/events/\${id}\`).then((r) =&gt; r.json());

  return {
    title: \`\${event.title} | Dev Event Platform\`,
    description: event.description,
    openGraph: {
      images: [event.bannerUrl],
    },
  };
}</code></pre>
                </div>
            </div>
    `,
    "codeSnippets": [
      {
        "lang": "tsx",
        "title": "Static Metadata Object",
        "code": "import { Metadata } from 'next';\nexport const metadata: Metadata = {\n  title: 'Dev Events Platform',\n  description: 'Find developer conferences near you',\n};"
      }
    ],
    "interactiveLab": `export default function Page() {
  const metadata = {
    title: 'Next.js 16 Conference 2026',
    ogImage: 'https://nextjs.org/og.png'
  };
  return (
    <div style={{ padding: '15px' }}>
      <h3>🏷️ SEO Metadata Preview</h3>
      <div>Title Tag: <strong>{metadata.title}</strong></div>
      <div>OpenGraph Image: <code>{metadata.ogImage}</code></div>
    </div>
  );
}`,
    "quiz": [
      {
        "question": "Fungsi apakah yang digunakan untuk membuat metadata SEO dinamis berdasarkan parameter URL di Next.js 16?",
        "options": [
          "getStaticProps()",
          "generateMetadata()",
          "useSEO()",
          "setHeadMeta()"
        ],
        "answer": 1,
        "explanation": "generateMetadata() adalah fungsi asinkron Next.js untuk menghasilkan metadata SEO secara dinamis."
      }
    ]
  },
  {
    "id": 9,
    "title": "09. Data Fetching & Caching Strategy di Next.js 16",
    "category": "Data & Caching",
    "videoId": "I1V9YWqRIeI",
    "duration": "31:10",
    "description": "Mendalami arsitektur Fetch API, Request Memoization, Static Rendering vs Dynamic Rendering pada Next.js 16.",
    "keyTakeaways": [
      "Penggunaan native `fetch()` di Server Components otomatis memanfaatkan Request Deduplication",
      "Model caching transparan: Static Rendering (default) vs Dynamic Rendering (`cache: 'no-store'`)",
      "Memahami 4 lapisan cache Next.js: Request Memoization, Data Cache, Full Route Cache, Router Cache"
    ],
    "fullArticle": `
            <div class="article-section">
                <h3>🌐 Strategi Data Fetching di Next.js 16</h3>
                <p>Next.js memperluas fungsi bawaan Web API <code>fetch()</code> dengan kemampuan caching dan revalidasi deklaratif di tingkat server.</p>
                <div class="callout callout-info">
                    <strong>Pilihan Opsi Fetch:</strong>
                    <ul>
                        <li><code>fetch(url, { cache: 'force-cache' })</code>: Static Data Cache permanen (default).</li>
                        <li><code>fetch(url, { cache: 'no-store' })</code>: Dynamic Data Fetch (selalu mengambil data terbaru tiap request).</li>
                        <li><code>fetch(url, { next: { revalidate: 3600 } })</code>: Incremental Static Regeneration (ISR) setiap 1 jam.</li>
                    </ul>
                </div>
            </div>
    `,
    "codeSnippets": [
      {
        "lang": "tsx",
        "title": "ISR Fetch Example",
        "code": "const res = await fetch('https://api.events.com/list', {\n  next: { revalidate: 60 } // Revalidate data every 60 seconds\n});"
      }
    ],
    "interactiveLab": `export default async function Page() {
  return (
    <div style={{ padding: '15px' }}>
      <h3>⚡ Data Fetching & Cache Simulator</h3>
      <p>Strategy: <code>fetch(url, &#123; next: &#123; revalidate: 60 &#125; &#125;)</code></p>
      <div style={{ color: '#4ade80' }}>Status: Incremental Static Regeneration Active (60s TTL)</div>
    </div>
  );
}`,
    "quiz": [
      {
        "question": "Opsi fetch manakah yang harus digunakan jika Anda ingin memastikan data SELALU di-fetch ulang dari server pada setiap request user (tanpa cache)?",
        "options": [
          "cache: 'force-cache'",
          "cache: 'no-store'",
          "next: { revalidate: 3600 }",
          "mode: 'cors'"
        ],
        "answer": 1,
        "explanation": "cache: 'no-store' memberitahu Next.js untuk tidak menyimpan cache dan selalu mengambil data segar pada setiap request."
      }
    ]
  },
  {
    "id": 10,
    "title": "10. Server Actions & Form Handling ('use server')",
    "category": "Data & Caching",
    "videoId": "I1V9YWqRIeI",
    "duration": "35:00",
    "description": "Mengabaikan boilerplate API routes dengan Server Actions, validasi form Zod, useFormStatus, dan useActionState.",
    "keyTakeaways": [
      "Server Actions didefinisikan dengan direktif `'use server'` di dalam fungsi atau file terpisah",
      "Dapat dipanggil langsung dari atribut `action={createEvent}` pada elemen HTML `<form>`",
      "Dukungan penuh untuk Progressive Enhancement (form tetap berfungsi meski JS client belum selesai di-load)"
    ],
    "fullArticle": `
            <div class="article-section">
                <h3>⚡ Revolusi Mutasi Data dengan Server Actions</h3>
                <p><strong>Server Actions</strong> memungkinkan Anda menulis fungsi backend yang dapat dipanggil langsung dari komponen React client atau form tanpa perlu membuat file API route secara terpisah di <code>app/api/</code>.</p>
            </div>

            <div class="article-section">
                <h3>💻 Kode Contoh Server Action</h3>
                <div class="code-container">
                    <div class="code-header"><span>app/actions.ts</span><button class="copy-btn" onclick="copyCode(this)">Copy</button></div>
                    <pre><code>"use server"; // Menandakan fungsi di file ini dieksekusi di server

import { revalidatePath } from "next/cache";

export async function createEvent(formData: FormData) {
  const title = formData.get("title") as string;
  const location = formData.get("location") as string;

  // Simpan ke database (Prisma / Supabase)
  console.log("Saving to DB:", { title, location });

  // Revalidasi cache halaman events agar UI terupdate otomatis
  revalidatePath("/events");
}</code></pre>
                </div>
            </div>
    `,
    "codeSnippets": [
      {
        "lang": "tsx",
        "title": "Form with Server Action",
        "code": "import { createEvent } from '@/app/actions';\nexport default function Form() {\n  return (\n    <form action={createEvent}>\n      <input name=\"title\" required />\n      <button type=\"submit\">Create Event</button>\n    </form>\n  );\n}"
      }
    ],
    "interactiveLab": `"use server";
export default function Page() {
  return (
    <div style={{ padding: '15px' }}>
      <h3>📝 Server Action Form Test</h3>
      <form style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxWidth: '300px' }}>
        <input placeholder="Nama Event..." style={{ padding: '8px' }} />
        <button style={{ background: '#0070f3', color: 'white', padding: '8px', border: 'none' }}>
          Simpan via 'use server'
        </button>
      </form>
    </div>
  );
}`,
    "quiz": [
      {
        "question": "Apakah keunggulan utama dari Progressive Enhancement pada Server Actions di Next.js?",
        "options": [
          "Aplikasi menjadi tidak bisa diakses dari HP",
          "Form tetap dapat disubmit meskipun JavaScript di browser pengguna belum selesai dimuat atau dimatikan",
          "Form tidak membutuhkan tombol submit",
          "Database otomatis terhapus"
        ],
        "answer": 1,
        "explanation": "Server Actions mendukung Progressive Enhancement sehingga form HTML dapat melakukan HTTP POST standar bahkan tanpa JS di client."
      }
    ]
  },
  {
    "id": 11,
    "title": "11. Revalidation & Dynamic Data Tagging (revalidatePath & revalidateTag)",
    "category": "Data & Caching",
    "videoId": "I1V9YWqRIeI",
    "duration": "26:40",
    "description": "On-demand cache invalidation menggunakan revalidatePath() dan revalidateTag() untuk memperbarui UI real-time.",
    "keyTakeaways": [
      "`revalidatePath('/events')` membersihkan cache untuk path URL tertentu",
      "`revalidateTag('events-list')` membersihkan cache spesifik berdasarkan tag data",
      "Best practice memanggil revalidasi di akhir eksekusi Server Action"
    ],
    "fullArticle": `
            <div class="article-section">
                <h3>🔄 On-Demand Cache Invalidation</h3>
                <p>Ketika mutasi data terjadi (misal: pengguna menambahkan event baru atau mengupdate profil), cache halaman terkait harus dibersihkan secara presisi menggunakan <strong>On-Demand Revalidation</strong>.</p>
                <ul>
                    <li><code>revalidatePath(path)</code>: Membersihkan cache seluruh komponen pada rute tersebut.</li>
                    <li><code>revalidateTag(tag)</code>: Membersihkan cache berlabel spesifik tanpa merusak cache halaman lain.</li>
                </ul>
            </div>
    `,
    "codeSnippets": [
      {
        "lang": "ts",
        "title": "revalidateTag Usage",
        "code": "import { revalidateTag } from 'next/cache';\nexport async function updateData() {\n  // mutate database...\n  revalidateTag('user-profile');\n}"
      }
    ],
    "interactiveLab": `export default function Page() {
  return (
    <div style={{ padding: '15px' }}>
      <h3>🔄 Cache Invalidation Test</h3>
      <p>Tagged Cache: <code>fetch(url, &#123; next: &#123; tags: ['events'] &#125; &#125;)</code></p>
      <button style={{ background: '#7928ca', color: 'white', padding: '8px 14px', border: 'none' }}>
        Trigger revalidateTag('events')
      </button>
    </div>
  );
}`,
    "quiz": [
      {
        "question": "Fungsi manakah yang paling efisien untuk membersihkan cache data tertentu secara spesifik di seluruh aplikasi berdasarkan label tag?",
        "options": [
          "revalidatePath()",
          "revalidateTag()",
          "clearLocalStorage()",
          "router.refresh()"
        ],
        "answer": 1,
        "explanation": "revalidateTag() memungkinkan Anda membatalkan cache secara tertarget berdasarkan tag kustom."
      }
    ]
  },
  {
    "id": 12,
    "title": "12. Cache Components & Direktif 'use cache'",
    "category": "Data & Caching",
    "videoId": "I1V9YWqRIeI",
    "duration": "19:20",
    "description": "Model caching eksplisit Next.js modern: menandai fungsi atau komponen sebagai dapat di-cache dengan 'use cache', mengatur masa berlakunya, dan membatalkannya lewat tag.",
    "keyTakeaways": [
      "Sejak Next.js 15, fetch TIDAK lagi di-cache secara bawaan — kebalikan dari Next 13/14",
      "'use cache' menandai fungsi, komponen, atau seluruh berkas sebagai dapat di-cache",
      "cacheLife mengatur masa berlaku, cacheTag menandai untuk pembatalan tertarget",
      "Argumen fungsi dan nilai baliknya harus dapat diserialisasi"
    ],
    "fullArticle": `
            <div class="article-section">
                <h3>📌 Kenapa Model Caching Berubah</h3>
                <p>Next.js 13 dan 14 melakukan caching secara <strong>agresif dan implisit</strong>: <code>fetch()</code> otomatis di-cache selamanya kecuali Anda menolaknya. Niatnya baik, hasilnya membingungkan — orang men-deploy aplikasi lalu bertanya-tanya kenapa datanya tidak pernah berubah.</p>
                <div class="callout callout-warning">
                    <strong>⚠️ Perubahan bawaan yang wajib diketahui</strong>
                    <p>Sejak <strong>Next.js 15</strong>, defaultnya dibalik menjadi <em>tidak di-cache</em>:</p>
                    <div class="code-container">
                        <pre><code>// Next 13/14: di-cache selamanya secara diam-diam
// Next 15/16: TIDAK di-cache, selalu ambil baru
const res = await fetch('https://api.contoh.com/produk');

// Route Handler GET juga tidak lagi di-cache secara bawaan.
// Begitu pula navigasi client-side router cache.</code></pre>
                    </div>
                    <p>Kalau Anda mengikuti tutorial era Next 13/14, asumsi caching di dalamnya sudah tidak berlaku. Caching sekarang harus diminta secara <strong>eksplisit</strong>.</p>
                </div>
            </div>

            <div class="article-section">
                <h3>💻 Direktif 'use cache'</h3>
                <p>Ditempatkan di baris pertama fungsi, komponen, atau berkas — menandai bahwa hasilnya boleh disimpan dan dipakai ulang.</p>
                <div class="code-container">
                    <div class="code-header"><span>app/produk/data.ts</span><button class="copy-btn" onclick="copyCode(this)">Copy</button></div>
                    <pre><code>import { unstable_cacheLife as cacheLife,
         unstable_cacheTag as cacheTag } from 'next/cache'

export async function ambilProduk(kategori: string) {
  'use cache'

  cacheLife('hours')            // profil masa berlaku
  cacheTag(\`produk-\${kategori}\`) // tag untuk pembatalan tertarget

  const res = await fetch(\`https://api.contoh.com/produk/\${kategori}\`)
  return res.json()
}</code></pre>
                </div>
                <p>Tiga tingkat penerapan:</p>
                <div class="code-container">
                    <pre><code>// 1. Seluruh berkas — semua ekspor di dalamnya dapat di-cache
'use cache'
export async function a() { ... }
export async function b() { ... }

// 2. Satu komponen
async function DaftarProduk({ kategori }) {
  'use cache'
  const produk = await ambilProduk(kategori)
  return &lt;ul&gt;{produk.map(p =&gt; &lt;li key={p.id}&gt;{p.nama}&lt;/li&gt;)}&lt;/ul&gt;
}

// 3. Satu fungsi saja (contoh paling atas)</code></pre>
                </div>
            </div>

            <div class="article-section">
                <h3>⏱️ Mengatur Masa Berlaku dengan cacheLife</h3>
                <div class="code-container">
                    <pre><code>cacheLife('seconds')   // sangat sering berubah
cacheLife('minutes')
cacheLife('hours')
cacheLife('days')
cacheLife('max')       // praktis permanen sampai dibatalkan

// Profil kustom di next.config.ts
export default {
  experimental: {
    cacheLife: {
      katalog: {
        stale: 60,        // detik — klien boleh pakai versi lama
        revalidate: 300,  // detik — server menyegarkan di latar
        expire: 3600,     // detik — setelah ini WAJIB ambil baru
      },
    },
  },
}

// lalu: cacheLife('katalog')</code></pre>
                </div>
                <div class="callout callout-info">
                    <strong>💡 Bedanya stale, revalidate, dan expire</strong>
                    <ul>
                        <li><strong>stale</strong> — berapa lama peramban boleh memakai salinannya tanpa bertanya ke server.</li>
                        <li><strong>revalidate</strong> — kapan server mulai menyegarkan di latar belakang, sementara pengunjung tetap dilayani versi lama. Inilah <em>stale-while-revalidate</em>.</li>
                        <li><strong>expire</strong> — batas keras. Setelah ini, permintaan harus menunggu data baru.</li>
                    </ul>
                </div>
            </div>

            <div class="article-section">
                <h3>🏷️ Pembatalan dengan Tag</h3>
                <div class="code-container">
                    <div class="code-header"><span>app/aksi.ts</span><button class="copy-btn" onclick="copyCode(this)">Copy</button></div>
                    <pre><code>'use server'
import { revalidateTag, revalidatePath } from 'next/cache'

export async function simpanProduk(data: FormData) {
  await db.produk.create({ ... })

  // Hanya membuang cache yang bertag ini
  revalidateTag('produk-elektronik')

  // Atau berdasarkan path
  revalidatePath('/produk')
}</code></pre>
                </div>
                <div class="callout callout-warning">
                    <strong>⚠️ Argumen dan nilai balik harus dapat diserialisasi</strong>
                    <p>Fungsi ber-<code>'use cache'</code> menyimpan hasilnya di luar proses, sehingga argumen dipakai sebagai bagian kunci cache dan nilai baliknya harus bisa diserialisasi. Melewatkan fungsi, kelas, atau objek <code>Date</code> yang tidak standar akan bermasalah. Lewatkan nilai primitif dan objek biasa saja.</p>
                </div>
                <div class="callout callout-danger">
                    <strong>🚫 Jangan menaruh data per-pengguna di dalam 'use cache'</strong>
                    <p>Cache dibagi antar seluruh pengunjung. Bila fungsi ber-<code>'use cache'</code> membaca cookie atau header untuk menentukan hasil, pengguna A bisa menerima data milik pengguna B. Data yang bergantung pada identitas harus berada <strong>di luar</strong> lapisan cache — atau jadikan ID pengguna sebagai argumen eksplisit sehingga ikut menjadi bagian kunci cache.</p>
                </div>
            </div>

            <div class="article-section">
                <h3>🧭 Status Kestabilan</h3>
                <div class="callout callout-info">
                    <p>Kemampuan ini diperkenalkan bertahap dan sebagian API-nya masih memakai awalan <code>unstable_</code> tergantung versi persis yang Anda pakai. Sebelum menerapkannya di produksi, jalankan <code>npx next info</code> untuk memastikan versi Anda, dan periksa apakah <code>cacheComponents</code> (atau <code>dynamicIO</code> pada versi yang lebih awal) perlu diaktifkan di <code>next.config.ts</code>. Konsep dan model mentalnya stabil; nama flag-nya yang masih bergerak.</p>
                </div>
            </div>
    `,
    "codeSnippets": [
      {
        "lang": "typescript",
        "title": "Fungsi ber-cache dengan tag",
        "code": "export async function ambilProduk(kategori: string) {\n  'use cache'\n  cacheLife('hours')\n  cacheTag(`produk-${kategori}`)\n\n  const res = await fetch(`https://api.contoh.com/produk/${kategori}`)\n  return res.json()\n}"
      }
    ],
    "interactiveLab": `// app/produk/data.ts
import { unstable_cacheTag as cacheTag } from 'next/cache'

export async function ambilKatalog() {
  'use cache'
  cacheTag('katalog')

  const res = await fetch('https://api.contoh.com/katalog')
  return res.json()
}

// app/aksi.ts
'use server'
import { revalidateTag } from 'next/cache'

export async function perbaruiKatalog() {
  await db.katalog.update({ ... })
  revalidateTag('katalog')   // katalog akan diambil ulang
}`,
    "quiz": [
      {
        "question": "Apa perbedaan perilaku fetch() bawaan antara Next.js 13/14 dan Next.js 15/16?",
        "options": [
          "Next 15/16 men-cache lebih agresif daripada sebelumnya",
          "Next 13/14 men-cache fetch secara otomatis, sedangkan Next 15/16 tidak men-cache secara bawaan sehingga caching harus diminta eksplisit",
          "fetch() tidak lagi tersedia di Next 15/16",
          "Tidak ada perubahan apa pun"
        ],
        "answer": 1,
        "explanation": "Caching implisit di Next 13/14 sering mengejutkan pengembang karena data tampak tidak pernah berubah. Sejak Next 15 defaultnya dibalik: fetch tidak di-cache, GET Route Handler tidak di-cache, dan caching harus dinyatakan secara eksplisit misalnya lewat direktif 'use cache'."
      },
      {
        "question": "Kenapa data yang bergantung pada identitas pengguna berbahaya bila ditaruh di dalam fungsi ber-'use cache'?",
        "options": [
          "Karena akan membuat aplikasi berjalan lambat",
          "Karena cache dibagi antar seluruh pengunjung, sehingga pengguna lain bisa menerima data yang bukan miliknya",
          "Karena Next.js akan menolak kompilasi",
          "Karena cookie tidak bisa dibaca di server"
        ],
        "answer": 1,
        "explanation": "Hasil fungsi ber-cache disimpan dan dipakai ulang lintas permintaan dan lintas pengunjung. Bila hasilnya bergantung pada cookie atau header identitas, salinan milik satu pengguna bisa disajikan ke pengguna lain. Data per-pengguna harus di luar lapisan cache, atau identitasnya dijadikan argumen eksplisit agar menjadi bagian kunci cache."
      }
    ]
  },
  {
    "id": 13,
    "title": "13. Partial Prerendering & Streaming",
    "category": "Data & Caching",
    "videoId": "I1V9YWqRIeI",
    "duration": "16:40",
    "description": "Menggabungkan kecepatan halaman statis dengan kesegaran data dinamis dalam satu respons: kerangka statis dikirim seketika, bagian dinamis mengalir menyusul.",
    "keyTakeaways": [
      "Sebelumnya satu halaman harus memilih: seluruhnya statis ATAU seluruhnya dinamis",
      "PPR mengirim kerangka statis lebih dulu, lalu mengalirkan bagian dinamis",
      "Suspense menentukan batas antara bagian statis dan dinamis",
      "Fallback Suspense yang buruk menyebabkan pergeseran tata letak"
    ],
    "fullArticle": `
            <div class="article-section">
                <h3>📌 Masalah yang Diselesaikan</h3>
                <div class="code-container">
                    <pre><code>Halaman produk berisi:
  ├─ Header, navigasi, footer      → sama untuk semua orang (statis)
  ├─ Deskripsi & gambar produk     → jarang berubah (statis)
  ├─ Harga & stok terkini          → harus segar (dinamis)
  └─ "Direkomendasikan untuk Anda" → per pengguna (dinamis)

Model lama: satu bagian dinamis membuat SELURUH halaman
dirender ulang tiap permintaan. Header yang tidak pernah
berubah pun ikut menunggu kueri stok selesai.</code></pre>
                </div>
                <p><strong>Partial Prerendering</strong> memecah asumsi itu. Kerangka statis sudah jadi sejak waktu build dan dikirim seketika; lubang-lubang dinamisnya diisi menyusul lewat streaming dalam respons yang sama.</p>
            </div>

            <div class="article-section">
                <h3>💻 Suspense sebagai Penanda Batas</h3>
                <div class="code-container">
                    <div class="code-header"><span>app/produk/[id]/page.tsx</span><button class="copy-btn" onclick="copyCode(this)">Copy</button></div>
                    <pre><code>import { Suspense } from 'react'

export default async function HalamanProduk({ params }) {
  const { id } = await params      // params adalah Promise di Next 15+
  const produk = await ambilProduk(id)   // ber-'use cache' → statis

  return (
    &lt;main&gt;
      {/* Semua ini masuk kerangka statis */}
      &lt;h1&gt;{produk.nama}&lt;/h1&gt;
      &lt;GambarProduk src={produk.gambar} /&gt;
      &lt;p&gt;{produk.deskripsi}&lt;/p&gt;

      {/* Lubang dinamis: dialirkan menyusul */}
      &lt;Suspense fallback={&lt;SkeletonHarga /&gt;}&gt;
        &lt;HargaDanStok id={id} /&gt;
      &lt;/Suspense&gt;

      &lt;Suspense fallback={&lt;SkeletonRekomendasi /&gt;}&gt;
        &lt;Rekomendasi untukPengguna /&gt;
      &lt;/Suspense&gt;
    &lt;/main&gt;
  )
}

// Komponen ini membaca data segar tiap permintaan
async function HargaDanStok({ id }: { id: string }) {
  const { harga, stok } = await db.produk.harga(id)
  return &lt;div&gt;Rp{harga} · sisa {stok}&lt;/div&gt;
}</code></pre>
                </div>
                <div class="callout callout-info">
                    <strong>💡 Aturannya sederhana</strong>
                    <p>Apa pun yang berada <strong>di dalam</strong> <code>&lt;Suspense&gt;</code> dan menyentuh data dinamis — <code>cookies()</code>, <code>headers()</code>, <code>searchParams</code>, atau kueri tanpa cache — menjadi lubang dinamis. Sisanya masuk kerangka statis. Anda mengendalikan pembagiannya lewat penempatan batas Suspense.</p>
                </div>
            </div>

            <div class="article-section">
                <h3>🔑 API Dinamis Kini Asinkron</h3>
                <div class="code-container">
                    <pre><code>// Next 14 — sinkron
const cookieStore = cookies()
const token = cookieStore.get('token')

// Next 15+ — WAJIB di-await
const cookieStore = await cookies()
const token = cookieStore.get('token')

const headersList = await headers()
const { id } = await params
const { q } = await searchParams</code></pre>
                </div>
                <div class="callout callout-warning">
                    <strong>⚠️ Ini perubahan yang merusak kode lama</strong>
                    <p><code>cookies()</code>, <code>headers()</code>, <code>params</code>, dan <code>searchParams</code> menjadi asinkron sejak Next 15. Perubahan ini yang memungkinkan Next menunda evaluasi bagian dinamis sampai kerangka statis terkirim. Kode dari tutorial Next 14 akan gagal atau memberi peringatan. Tersedia codemod untuk migrasi otomatis:</p>
                    <div class="code-container">
                        <pre><code>npx @next/codemod@latest next-async-request-api .</code></pre>
                    </div>
                </div>
            </div>

            <div class="article-section">
                <h3>🎨 Fallback yang Baik Menentukan Kualitas</h3>
                <div class="code-container">
                    <pre><code>// ❌ Menyebabkan pergeseran tata letak — tinggi berubah saat data tiba
&lt;Suspense fallback={&lt;p&gt;Memuat…&lt;/p&gt;}&gt;

// ✅ Skeleton berukuran sama dengan konten aslinya
&lt;Suspense fallback={
  &lt;div className="h-14 w-40 animate-pulse rounded bg-neutral-200" /&gt;
}&gt;</code></pre>
                </div>
                <div class="callout callout-danger">
                    <strong>🚫 Cumulative Layout Shift adalah biaya tersembunyi streaming</strong>
                    <p>Streaming memperbaiki waktu tampil pertama, tetapi bila fallback berukuran berbeda dari konten aslinya, halaman akan "meloncat" saat data tiba. Pengguna yang sedang membaca atau hendak menekan tombol akan terganggu, dan skor Core Web Vitals Anda turun. Buat skeleton dengan <strong>dimensi yang sama persis</strong> dengan konten yang akan menggantikannya.</p>
                </div>
            </div>

            <div class="article-section">
                <h3>⚙️ Mengaktifkan &amp; Memeriksa</h3>
                <div class="code-container">
                    <pre><code>// next.config.ts — nama flag berbeda antar versi,
// periksa dokumentasi untuk versi yang Anda pakai
export default {
  experimental: {
    ppr: 'incremental',   // aktifkan per-rute
  },
}

// lalu pada rute yang diinginkan:
export const experimental_ppr = true</code></pre>
                </div>
                <div class="code-container">
                    <pre><code># Melihat rute mana yang statis, dinamis, atau parsial
npm run build

# Keluarannya menandai tiap rute:
#   ○  Static     — dirender saat build
#   ●  SSG        — statis dengan generateStaticParams
#   ƒ  Dynamic    — dirender tiap permintaan
#   ◐  Partial    — kerangka statis + lubang dinamis</code></pre>
                </div>
                <div class="callout callout-tip">
                    <strong>📌 Baca keluaran build setiap kali</strong>
                    <p>Satu pemanggilan <code>cookies()</code> yang tidak sengaja berada di luar Suspense akan mengubah seluruh rute menjadi dinamis, dan Anda kehilangan manfaat prerendering tanpa peringatan apa pun. Tabel rute di akhir <code>next build</code> adalah cara tercepat menangkapnya — jadikan kebiasaan memeriksanya sebelum deploy.</p>
                </div>
            </div>
    `,
    "codeSnippets": [
      {
        "lang": "tsx",
        "title": "Batas Suspense untuk PPR",
        "code": "export default async function Halaman({ params }) {\n  const { id } = await params\n  const produk = await ambilProduk(id)   // statis\n\n  return (\n    <main>\n      <h1>{produk.nama}</h1>\n      <Suspense fallback={<SkeletonHarga />}>\n        <HargaDanStok id={id} />       {/* dinamis */}\n      </Suspense>\n    </main>\n  )\n}"
      }
    ],
    "interactiveLab": `import { Suspense } from 'react'

export default async function Halaman({ params }) {
  const { id } = await params            // Next 15+: params adalah Promise

  return (
    <main>
      <h1>Kerangka statis — tampil seketika</h1>

      <Suspense fallback={<div className="h-14 w-40 animate-pulse bg-neutral-200" />}>
        <BagianDinamis id={id} />
      </Suspense>
    </main>
  )
}

async function BagianDinamis({ id }) {
  const data = await db.ambil(id)        // tidak di-cache
  return <div>Stok: {data.stok}</div>
}`,
    "quiz": [
      {
        "question": "Apa yang menentukan batas antara bagian statis dan bagian dinamis pada Partial Prerendering?",
        "options": [
          "Konfigurasi di next.config.ts saja",
          "Penempatan batas <Suspense> — apa pun di dalamnya yang menyentuh data dinamis menjadi lubang yang dialirkan menyusul",
          "Urutan berkas di dalam direktori app/",
          "Ukuran komponen dalam kilobyte"
        ],
        "answer": 1,
        "explanation": "Suspense menjadi penanda batas. Konten di luar Suspense yang tidak menyentuh API dinamis masuk ke kerangka statis yang dirender saat build; konten di dalam Suspense yang membaca cookies, headers, searchParams, atau kueri tanpa cache dievaluasi per permintaan lalu dialirkan ke peramban."
      },
      {
        "question": "Kenapa cookies() dan params menjadi asinkron sejak Next.js 15?",
        "options": [
          "Untuk mengurangi ukuran bundle JavaScript",
          "Agar Next dapat menunda evaluasi bagian dinamis sehingga kerangka statis bisa dikirim lebih dulu",
          "Karena JavaScript tidak lagi mendukung fungsi sinkron",
          "Untuk kompatibilitas dengan React 18"
        ],
        "answer": 1,
        "explanation": "Selama API dinamis bersifat sinkron, Next harus mengevaluasinya sebelum merender apa pun, sehingga seluruh rute menjadi dinamis. Menjadikannya asinkron memungkinkan Next mengirim bagian statis lebih dulu dan menyelesaikan bagian dinamis belakangan — fondasi teknis dari Partial Prerendering."
      }
    ]
  },
  {
    "id": 14,
    "title": "14. State Management & Advanced React 19 Hooks (useOptimistic, useActionState)",
    "category": "Data & Caching",
    "videoId": "I1V9YWqRIeI",
    "duration": "30:00",
    "description": "Menggunakan fitur mutasi responsif React 19: update UI instan dengan useOptimistic dan status form dengan useActionState.",
    "keyTakeaways": [
      "`useOptimistic` memperbarui UI secara instan sebelum respon server selesai diterima",
      "`useActionState` mengelola state hasil eksekusi Server Action (error message, status)",
      "Pola state management terdistribusi tanpa perlu Redux overhead"
    ],
    "fullArticle": `
            <div class="article-section">
                <h3>⚡ React 19 Optimistic UI Updates</h3>
                <p>Dalam aplikasi modern seperti Dev Event Platform, ketika pengguna menekan tombol "Like" atau "Bookmark", UI harus merespons dalam 0 milidetik tanpa menunggu siklus bolak-balik server.</p>
            </div>
    `,
    "codeSnippets": [
      {
        "lang": "tsx",
        "title": "useOptimistic Hook",
        "code": "import { useOptimistic } from 'react';\n// Optimistic update pattern..."
      }
    ],
    "interactiveLab": `"use client";
export default function Page() {
  return (
    <div style={{ padding: '15px' }}>
      <h3>🚀 React 19 useOptimistic Test</h3>
      <div style={{ color: '#00dfd8' }}>UI State: Updated Instantly (0ms Latency)</div>
    </div>
  );
}`,
    "quiz": [
      {
        "question": "Apakah kegunaan utama dari Hook React 19 useOptimistic?",
        "options": [
          "Untuk memperlambat aplikasi",
          "Untuk memperbarui tampilan UI secara instan seolah-olah operasi server telah berhasil sebelum konfirmasi server tiba",
          "Untuk menghapus cookie",
          "Untuk mengubah font teks"
        ],
        "answer": 1,
        "explanation": "useOptimistic memberikan pengalaman pengguna yang sangat responsif dengan mengasumsikan transaksi server sukses secara cepat."
      }
    ]
  },
  {
    "id": 15,
    "title": "15. API Routes & Route Handlers (app/api/route.ts)",
    "category": "Backend & API",
    "videoId": "I1V9YWqRIeI",
    "duration": "23:50",
    "description": "Membuat RESTful API endpoints di Next.js 16 menggunakan NextRequest & NextResponse untuk integrasi Webhook & Mobile Apps.",
    "keyTakeaways": [
      "File `route.ts` di dalam direktori `app/api/...` membuat HTTP API Endpoint",
      "Mendukung HTTP Methods ekspor terpisah: `GET`, `POST`, `PUT`, `PATCH`, `DELETE`",
      "Menggunakan objek helper `NextRequest` dan `NextResponse`"
    ],
    "fullArticle": `
            <div class="article-section">
                <h3>🛠️ Konstruksi Route Handlers di Next.js 16</h3>
                <p>Jika aplikasi Anda membutuhkan Webhook receiver (Stripe, Midtrans) atau API publik untuk konsumsi Mobile App, kita menggunakan <strong>Route Handlers</strong> di <code>app/api/route.ts</code>.</p>
            </div>

            <div class="article-section">
                <h3>💻 Kode REST API Endpoint</h3>
                <div class="code-container">
                    <div class="code-header"><span>app/api/events/route.ts</span><button class="copy-btn" onclick="copyCode(this)">Copy</button></div>
                    <pre><code>import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");

  const data = [
    { id: 1, title: "React 19 Workshop", category: "frontend" },
    { id: 2, title: "Next.js 16 Summit", category: "fullstack" },
  ];

  return NextResponse.json({ success: true, data });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  return NextResponse.json({ success: true, created: body }, { status: 201 });
}</code></pre>
                </div>
            </div>
    `,
    "codeSnippets": [
      {
        "lang": "ts",
        "title": "Route Handler GET/POST",
        "code": "import { NextResponse } from 'next/server';\nexport async function GET() {\n  return NextResponse.json({ message: 'Hello API' });\n}"
      }
    ],
    "interactiveLab": `export default function Page() {
  return (
    <div style={{ padding: '15px' }}>
      <h3>🌐 Route Handler Endpoint Preview</h3>
      <div>Endpoint Path: <code>/api/v1/events</code></div>
      <div>Supported Methods: <strong style={{ color: '#0070f3' }}>GET, POST, DELETE</strong></div>
    </div>
  );
}`,
    "quiz": [
      {
        "question": "Dapatkah file page.tsx dan route.ts berada di dalam folder rute dinamis yang sama secara bersamaan?",
        "options": [
          "Ya, bisa tanpa konflik",
          "Tidak, akan terjadi konflik rute di mana route.ts mengambil alih rute tersebut",
          "Hanya bisa jika menggunakan Tailwind",
          "Hanya di versi Next.js 12"
        ],
        "answer": 1,
        "explanation": "page.tsx dan route.ts tidak boleh ada di segmen rute yang sama karena keduanya menangani request HTTP ke URL yang identik."
      }
    ]
  },
  {
    "id": 16,
    "title": "16. Middleware, Security & Authentication Flow",
    "category": "Backend & API",
    "videoId": "I1V9YWqRIeI",
    "duration": "29:15",
    "description": "Menangani proteksi route dengan middleware.ts, verifikasi JWT/Session Cookie, Redirects, dan NextAuth / Clerk integration.",
    "keyTakeaways": [
      "File `middleware.ts` diletakkan di root proyek untuk mencegat setiap HTTP Request",
      "Berjalan di Edge Runtime sebelum request mencapai Server Components / Page",
      "Digunakan untuk proteksi rute terautentikasi (Protected Routes), I18n, & Header security"
    ],
    "fullArticle": `
            <div class="article-section">
                <h3>🛡️ Arsitektur Next.js Middleware</h3>
                <p><strong>Middleware</strong> dieksekusi sebelum request diproses oleh render engine. Ini sangat ideal untuk memeriksa apakah cookie sesi autentikasi pengguna valid sebelum mengizinkan akses ke rute <code>/dashboard</code>.</p>
            </div>

            <div class="article-section">
                <h3>💻 Kode Contoh middleware.ts</h3>
                <div class="code-container">
                    <div class="code-header"><span>middleware.ts</span><button class="copy-btn" onclick="copyCode(this)">Copy</button></div>
                    <pre><code>import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("session_token")?.value;

  // Jika mencoba akses dashboard tanpa token, redirect ke login
  if (!token && request.nextUrl.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
};</code></pre>
                </div>
            </div>
    `,
    "codeSnippets": [
      {
        "lang": "ts",
        "title": "Route Protection Middleware",
        "code": "import { NextResponse, NextRequest } from 'next/server';\nexport function middleware(req: NextRequest) {\n  const token = req.cookies.get('token');\n  if (!token) return NextResponse.redirect(new URL('/login', req.url));\n}"
      }
    ],
    "interactiveLab": `export default function Page() {
  return (
    <div style={{ padding: '15px' }}>
      <h3>🔒 Edge Middleware Simulator</h3>
      <div>Protected Matcher: <code>/dashboard/*</code></div>
      <div style={{ color: '#fbbf24', marginTop: '6px' }}>Action: Redirect unauthenticated requests to /login</div>
    </div>
  );
}`,
    "quiz": [
      {
        "question": "Di lingkungan manakah file middleware.ts dijalankan oleh Next.js secara default?",
        "options": [
          "Browser Client Only",
          "Edge Runtime (Ringan & Cepat)",
          "Database Engine",
          "Docker Container Master"
        ],
        "answer": 1,
        "explanation": "Middleware dijalankan di Edge Runtime sebelum rute diproses untuk memastikan respons pengalihan (redirect) tercepat."
      }
    ]
  },
  {
    "id": 17,
    "title": "17. proxy.ts, after() & Migrasi ke Next.js 16",
    "category": "Backend & API",
    "videoId": "I1V9YWqRIeI",
    "duration": "15:10",
    "description": "Perubahan yang merusak kompatibilitas saat naik ke Next.js 16, penggantian middleware, menjalankan pekerjaan setelah respons terkirim, dan alur migrasi yang aman.",
    "keyTakeaways": [
      "middleware.ts berganti nama menjadi proxy.ts di Next.js 16",
      "after() menjalankan pekerjaan SETELAH respons dikirim ke pengguna",
      "Turbopack menjadi bundler bawaan, termasuk untuk build produksi",
      "Codemod resmi menangani sebagian besar perubahan otomatis"
    ],
    "fullArticle": `
            <div class="article-section">
                <h3>📌 Ringkasan Perubahan Besar</h3>
                <table class="tech-table">
                    <thead><tr><th>Perubahan</th><th>Dampak</th></tr></thead>
                    <tbody>
                        <tr><td><code>middleware.ts</code> → <code>proxy.ts</code></td><td>Berkas harus diganti nama; penamaan baru mencerminkan perannya sebagai proxy tepi, bukan middleware aplikasi</td></tr>
                        <tr><td><strong>Turbopack bawaan</strong></td><td>Dipakai untuk <code>dev</code> maupun <code>build</code>; konfigurasi webpack kustom perlu ditinjau ulang</td></tr>
                        <tr><td><strong>API dinamis asinkron</strong></td><td><code>cookies()</code>, <code>headers()</code>, <code>params</code>, <code>searchParams</code> wajib di-<code>await</code></td></tr>
                        <tr><td><strong>Caching eksplisit</strong></td><td><code>fetch</code> tidak lagi di-cache secara bawaan</td></tr>
                        <tr><td><strong>React 19</strong></td><td>Pustaka pihak ketiga yang belum mendukung React 19 bisa bermasalah</td></tr>
                        <tr><td><strong>Node.js minimum naik</strong></td><td>Versi Node lama tidak lagi didukung — periksa runtime di CI dan produksi</td></tr>
                    </tbody>
                </table>
                <div class="callout callout-info">
                    <strong>💡 Catatan kejujuran</strong>
                    <p>Detail nama flag dan versi minimum bergerak cukup cepat antar rilis. Perlakukan tabel di atas sebagai peta arah, dan verifikasi angka pastinya lewat <code>npx next info</code> serta panduan upgrade resmi untuk versi yang Anda tuju.</p>
                </div>
            </div>

            <div class="article-section">
                <h3>🔀 Dari middleware.ts ke proxy.ts</h3>
                <div class="code-container">
                    <div class="code-header"><span>proxy.ts (sebelumnya middleware.ts)</span><button class="copy-btn" onclick="copyCode(this)">Copy</button></div>
                    <pre><code>import { NextResponse, type NextRequest } from 'next/server'

export default function proxy(request: NextRequest) {
  const token = request.cookies.get('sesi')?.value

  if (!token && request.nextUrl.pathname.startsWith('/dasbor')) {
    const url = request.nextUrl.clone()
    url.pathname = '/masuk'
    url.searchParams.set('kembali', request.nextUrl.pathname)
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dasbor/:path*', '/pengaturan/:path*'],
}</code></pre>
                </div>
                <div class="callout callout-danger">
                    <strong>🚫 Jangan jadikan proxy sebagai satu-satunya lapisan keamanan</strong>
                    <p>Proxy berjalan di tepi (edge) dan tepat untuk pengalihan cepat serta pemeriksaan kasar. Ia <strong>bukan</strong> tempat menegakkan otorisasi. Kelemahan di lapisan ini pernah menjadi celah nyata pada aplikasi Next.js. Otorisasi yang sesungguhnya harus diperiksa ulang di <strong>Server Component, Server Action, dan Route Handler</strong> — sedekat mungkin dengan data yang dilindungi. Anggap proxy hanya sebagai pengarah lalu lintas.</p>
                </div>
            </div>

            <div class="article-section">
                <h3>⏭️ after(): Pekerjaan Setelah Respons Terkirim</h3>
                <div class="code-container">
                    <div class="code-header"><span>app/aksi.ts</span><button class="copy-btn" onclick="copyCode(this)">Copy</button></div>
                    <pre><code>import { after } from 'next/server'

export async function POST(request: Request) {
  const data = await request.json()
  const pesanan = await db.pesanan.create({ data })

  // Dijalankan SETELAH respons dikirim ke pengguna.
  // Pengguna tidak perlu menunggu tugas ini selesai.
  after(async () =&gt; {
    await catatAnalitik('pesanan_dibuat', pesanan.id)
    await kirimWebhook(pesanan)
  })

  return Response.json({ id: pesanan.id })
}</code></pre>
                </div>
                <div class="callout callout-info">
                    <strong>💡 Kegunaan yang tepat</strong>
                    <p>Pencatatan analitik, pengiriman event, pembaruan cache, dan log audit — semua pekerjaan yang <em>tidak memengaruhi apa yang dilihat pengguna</em>. Sebelum ada <code>after()</code>, hal-hal ini menambah latensi respons tanpa alasan.</p>
                </div>
                <div class="callout callout-warning">
                    <strong>⚠️ Bukan pengganti antrean tugas</strong>
                    <p><code>after()</code> berjalan di dalam lingkup permintaan yang sama. Bila prosesnya berakhir — instance serverless dihentikan, kontainer di-restart — pekerjaan yang belum selesai <strong>hilang tanpa jejak dan tanpa percobaan ulang</strong>. Untuk pekerjaan yang tidak boleh hilang seperti email verifikasi atau pemrosesan pembayaran, tetap gunakan antrean tugas yang durabel.</p>
                </div>
            </div>

            <div class="article-section">
                <h3>🛠️ Alur Migrasi yang Aman</h3>
                <div class="code-container">
                    <pre><code># 1. Pastikan versi saat ini sehat dan tidak ada peringatan
npm run build

# 2. Jalankan codemod resmi — menangani sebagian besar perubahan
npx @next/codemod@latest upgrade latest

# 3. Codemod spesifik bila diperlukan
npx @next/codemod@latest next-async-request-api .

# 4. Ganti nama berkas middleware
git mv middleware.ts proxy.ts

# 5. Bangun ulang dan periksa tabel rute
npm run build

# 6. Jalankan uji E2E sebelum deploy
npm run test:e2e</code></pre>
                </div>
                <div class="callout callout-tip">
                    <strong>📌 Naik satu versi mayor sekaligus</strong>
                    <p>Melompat dari Next 13 langsung ke 16 menggabungkan beberapa gelombang perubahan sekaligus, dan ketika ada yang rusak Anda tidak tahu perubahan mana penyebabnya. Naik bertahap — 13 → 14 → 15 → 16 — dengan build dan uji di tiap langkah jauh lebih mudah ditelusuri, meski terasa lebih lambat.</p>
                </div>
            </div>

            <div class="article-section">
                <h3>🧪 Yang Sering Rusak Setelah Upgrade</h3>
                <ul>
                    <li><strong>Pustaka pihak ketiga yang belum mendukung React 19</strong> — periksa <code>peerDependencies</code> sebelum upgrade, terutama pustaka UI dan animasi.</li>
                    <li><strong>Konfigurasi webpack kustom</strong> — Turbopack tidak memakai loader dan plugin webpack yang sama.</li>
                    <li><strong>Data yang tiba-tiba selalu segar</strong> — bukan bug, ini akibat caching yang tidak lagi otomatis. Tambahkan <code>'use cache'</code> di tempat yang memang perlu.</li>
                    <li><strong>Peringatan sinkron pada cookies/params</strong> — jalankan codemod async request API.</li>
                    <li><strong>Tagihan hosting naik</strong> — rute yang sebelumnya statis bisa menjadi dinamis tanpa disadari. Periksa tabel rute pada keluaran build.</li>
                </ul>
            </div>
    `,
    "codeSnippets": [
      {
        "lang": "typescript",
        "title": "after() untuk pekerjaan latar",
        "code": "import { after } from 'next/server'\n\nexport async function POST(request: Request) {\n  const pesanan = await db.pesanan.create({ ... })\n\n  after(async () => {\n    await catatAnalitik('pesanan_dibuat', pesanan.id)\n  })\n\n  return Response.json({ id: pesanan.id })\n}"
      }
    ],
    "interactiveLab": `import { NextResponse, type NextRequest } from 'next/server'

// proxy.ts — pengganti middleware.ts di Next.js 16
export default function proxy(request: NextRequest) {
  const sesi = request.cookies.get('sesi')?.value

  if (!sesi && request.nextUrl.pathname.startsWith('/dasbor')) {
    const url = request.nextUrl.clone()
    url.pathname = '/masuk'
    return NextResponse.redirect(url)
  }
  return NextResponse.next()
}

export const config = { matcher: ['/dasbor/:path*'] }

// Ingat: otorisasi sesungguhnya tetap diperiksa
// di Server Component / Server Action, bukan di sini.`,
    "quiz": [
      {
        "question": "Kenapa proxy.ts (dulu middleware.ts) tidak boleh dijadikan satu-satunya lapisan otorisasi?",
        "options": [
          "Karena proxy.ts hanya berjalan saat pengembangan",
          "Karena ia berjalan di tepi dan hanya cocok untuk pengarahan lalu lintas; otorisasi harus diperiksa ulang sedekat mungkin dengan data, di Server Component, Server Action, dan Route Handler",
          "Karena proxy.ts tidak bisa membaca cookie",
          "Karena proxy.ts selalu dilewati oleh peramban modern"
        ],
        "answer": 1,
        "explanation": "Lapisan tepi berguna untuk pengalihan cepat, tetapi menjadikannya satu-satunya penjaga berarti seluruh keamanan bergantung pada satu titik yang bisa dilewati bila ada kelemahan pada pencocokan rute. Pemeriksaan otorisasi harus diulang di tempat data benar-benar diakses."
      },
      {
        "question": "Kapan after() TIDAK boleh dipakai?",
        "options": [
          "Untuk mencatat analitik setelah respons terkirim",
          "Untuk pekerjaan yang tidak boleh hilang seperti mengirim email verifikasi, karena after() tidak punya persistensi maupun percobaan ulang",
          "Untuk memperbarui cache setelah mutasi",
          "Untuk mengirim event ke sistem pemantauan"
        ],
        "answer": 1,
        "explanation": "after() menjalankan pekerjaan di dalam lingkup permintaan yang sama, setelah respons dikirim. Bila proses berakhir sebelum pekerjaan itu selesai, tidak ada mekanisme yang mengulangnya dan tidak ada catatan bahwa ia gagal. Pekerjaan kritis membutuhkan antrean tugas dengan broker yang durabel."
      }
    ]
  },
  {
    "id": 18,
    "title": "18. Database Integration dengan Prisma & PostgreSQL",
    "category": "Backend & API",
    "videoId": "I1V9YWqRIeI",
    "duration": "33:00",
    "description": "Menghubungkan aplikasi Next.js 16 ke PostgreSQL menggunakan Prisma ORM, Singleton client pattern, & Serverless Connection Pooling.",
    "keyTakeaways": [
      "Mendesain schema relational di `prisma/schema.prisma`",
      "Mencegah kebocoran koneksi database di lingkungan dev dengan Prisma Singleton Pattern",
      "Query data langsung di dalam React Server Component tanpa REST API overhead"
    ],
    "fullArticle": `
            <div class="article-section">
                <h3>🗄️ Database Access di Server Components</h3>
                <p>Karena React Server Components dieksekusi di server, kita dapat melakukan query database secara langsung menggunakan ORM seperti <strong>Prisma</strong> atau <strong>Drizzle</strong> tanpa memerlukan fetch API internal!</p>
            </div>

            <div class="article-section">
                <h3>💻 Prisma Client Singleton Implementation</h3>
                <div class="code-container">
                    <div class="code-header"><span>lib/prisma.ts</span><button class="copy-btn" onclick="copyCode(this)">Copy</button></div>
                    <pre><code>import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const db = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;</code></pre>
                </div>
            </div>
    `,
    "codeSnippets": [
      {
        "lang": "tsx",
        "title": "Direct Database Query in RSC",
        "code": "import { db } from '@/lib/prisma';\nexport default async function EventsList() {\n  const events = await db.event.findMany();\n  return <div>Total Events: {events.length}</div>;\n}"
      }
    ],
    "interactiveLab": `export default async function Page() {
  // Simulasi Direct DB Query
  const events = [
    { id: 1, name: 'Fullstack Next.js Conf' },
    { id: 2, name: 'AI Engineering Meetup' }
  ];
  return (
    <div style={{ padding: '15px' }}>
      <h3>🗄️ Prisma Query Results (RSC Direct)</h3>
      <ul>
        {events.map(e => <li key={e.id}>{e.name}</li>)}
      </ul>
    </div>
  );
}`,
    "quiz": [
      {
        "question": "Mengapa kita disarankan menggunakan pola Singleton Pattern untuk instansiasi PrismaClient di Next.js saat fase development?",
        "options": [
          "Agar kode terlihat lebih rapi",
          "Untuk mencegah kehabisan batas koneksi database akibat Hot Module Replacement (HMR) yang membuat instansi baru berulang kali",
          "Agar database berjalan di browser",
          "Agar tidak perlu menginstall TypeScript"
        ],
        "answer": 1,
        "explanation": "Dalam fase development, HMR Next.js dapat membuat puluhan instansi PrismaClient baru jika tidak menggunakan Singleton pattern."
      }
    ]
  },
  {
    "id": 19,
    "title": "19. Security Best Practices & Environment Variables Protection",
    "category": "Backend & API",
    "videoId": "I1V9YWqRIeI",
    "duration": "23:30",
    "description": "Amankan kredensial rahasia dengan .env.local, pembatasan prefix NEXT_PUBLIC_, dan pencegahan XSS/CSRF.",
    "keyTakeaways": [
      "Variabel tanpa prefix `NEXT_PUBLIC_` HANYA dapat diakses di Server Side (Database URL, Secret Keys)",
      "Variabel dengan prefix `NEXT_PUBLIC_` di-inline ke dalam bundle JavaScript client",
      "Pola paket `@next/env` & validasi T3 Env dengan Zod"
    ],
    "fullArticle": `
            <div class="article-section">
                <h3>🔐 Pengelolaan Kredensial Lingkungan (ENV)</h3>
                <p>Keamanan variabel lingkungan sangat vital agar API Key rahasia (seperti Stripe Secret Key, Database Password) tidak bocor ke browser publik.</p>
            </div>
    `,
    "codeSnippets": [
      {
        "lang": "bash",
        "title": ".env.local Security",
        "code": "DATABASE_URL=\"postgresql://admin:secret@localhost:5432/db\"\nNEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=\"pk_test_123\""
      }
    ],
    "interactiveLab": `export default function Page() {
  return (
    <div style={{ padding: '15px' }}>
      <h3>🔐 ENV Security Audit</h3>
      <div style={{ color: '#4ade80' }}>DATABASE_URL: Protected (Server Only)</div>
      <div style={{ color: '#38bdf8' }}>NEXT_PUBLIC_API_URL: Exposed to Browser</div>
    </div>
  );
}`,
    "quiz": [
      {
        "question": "Apakah akibatnya jika Anda lupa dan menambahkan prefix NEXT_PUBLIC_ pada variabel DATABASE_URL?",
        "options": [
          "Database menjadi lebih cepat",
          "URL & Password database rahasia Anda akan bocor dan dapat dilihat oleh publik di browser client",
          "Next.js akan menolak untuk build",
          "Komputer pengguna akan mati"
        ],
        "answer": 1,
        "explanation": "Prefix NEXT_PUBLIC_ membuat Next.js memasukkan nilai variabel tersebut secara publik ke dalam bundle JavaScript browser."
      }
    ]
  },
  {
    "id": 20,
    "title": "20. Optimasi Media: Image, Font, Script & Dynamic Imports",
    "category": "Optimization & Deploy",
    "videoId": "I1V9YWqRIeI",
    "duration": "27:15",
    "description": "Mencapai nilai Core Web Vitals 100 dengan next/image, next/font, next/script, dan Code Splitting dynamic().",
    "keyTakeaways": [
      "Komponen `<Image>` otomatis mengubah format ke AVIF/WebP, resizing, & mencegah Layout Shift (CLS)",
      "`next/font` mengunduh Google Fonts secara otomatis saat waktu build (Zero Cumulative Layout Shift)",
      "`dynamic()` untuk Lazy Loading komponen berat berbasis Client"
    ],
    "fullArticle": `
            <div class="article-section">
                <h3>🚀 Teknik Optimasi Performa Next.js 16</h3>
                <p>Next.js menyediakan komponen optimasi otomatis untuk memastikan skor Google Lighthouse (LCP, CLS, INP) mencapai hasil terbaik.</p>
            </div>

            <div class="article-section">
                <h3>💻 Contoh Lazy Loading dengan dynamic()</h3>
                <div class="code-container">
                    <div class="code-header"><span>components/EventMap.tsx</span><button class="copy-btn" onclick="copyCode(this)">Copy</button></div>
                    <pre><code>import dynamic from "next/dynamic";

// Memuat komponen peta berat hanya di sisi client saat dibutuhkan
const LeafletMap = dynamic(() =&gt; import("@/components/LeafletMap"), {
  ssr: false,
  loading: () =&gt; &lt;p&gt;Memuat Peta...&lt;/p&gt;,
});

export default function EventLocation() {
  return &lt;LeafletMap /&gt;;
}</code></pre>
                </div>
            </div>
    `,
    "codeSnippets": [
      {
        "lang": "tsx",
        "title": "Next Image Usage",
        "code": "import Image from 'next/image';\nexport function Banner() {\n  return <Image src=\"/banner.jpg\" alt=\"Event Banner\" width={800} height={400} priority />;\n}"
      }
    ],
    "interactiveLab": `export default function Page() {
  return (
    <div style={{ padding: '15px' }}>
      <h3>🖼️ next/image Optimization Preview</h3>
      <div>Auto Format: <code>image/avif</code></div>
      <div>Zero CLS Layout: Width/Height Reserved</div>
    </div>
  );
}`,
    "quiz": [
      {
        "question": "Mengapa komponen next/image jauh lebih unggul dibandingkan tag <img> HTML biasa?",
        "options": [
          "Karena menghapus gambar dari server",
          "Karena otomatis melakukan kompresi format (WebP/AVIF), responsive resizing, dan mencegah Cumulative Layout Shift (CLS)",
          "Karena mengubah gambar menjadi file teks",
          "Karena membuat gambar berwarna merah"
        ],
        "answer": 1,
        "explanation": "next/image mengoptimalkan gambar secara otomatis demi performa Core Web Vitals terbaik."
      }
    ]
  },
  {
    "id": 21,
    "title": "21. Analytics, PostHog & Monitoring Real-time",
    "category": "Optimization & Deploy",
    "videoId": "I1V9YWqRIeI",
    "duration": "25:10",
    "description": "Melacak perilaku pengguna, funnel konversi tiket event, dan error tracking dengan PostHog Analytics & OpenTelemetry.",
    "keyTakeaways": [
      "Integrasi PostHog provider pada Root Layout Next.js 16",
      "Melacak event navigasi rute secara otomatis via Client Component listener",
      "Feature Flags & A/B Testing terintegrasi"
    ],
    "fullArticle": `
            <div class="article-section">
                <h3>📊 Memantau Aplikasi di Production</h3>
                <p>Untuk memahami bagaimana pengguna berinteraksi dengan platform event kita, integrasi analytics seperti <strong>PostHog</strong> sangat krusial.</p>
            </div>
    `,
    "codeSnippets": [
      {
        "lang": "tsx",
        "title": "PostHog Provider",
        "code": "import posthog from 'posthog-js';\n// PostHog setup code..."
      }
    ],
    "interactiveLab": `export default function Page() {
  return (
    <div style={{ padding: '15px' }}>
      <h3>📊 PostHog Telemetry Preview</h3>
      <div>Captured Event: <code>event_ticket_booked</code></div>
    </div>
  );
}`,
    "quiz": [
      {
        "question": "Mengapa pelacakan navigasi halaman pada Next.js App Router perlu dipasang pada Client Component listener?",
        "options": [
          "Karena App Router menggunakan Client-side Navigation (SPA-like) antar halaman tanpa reload penuh browser",
          "Karena server tidak tahu URL aplikasi",
          "Karena HTML tidak mendukung JavaScript",
          "Hanya syarat формаitas"
        ],
        "answer": 0,
        "explanation": "App Router menggunakan Router Cache & Client Navigation sehingga perubahan rute terjadi di client tanpa reload halaman penuh."
      }
    ]
  },
  {
    "id": 22,
    "title": "22. Testing Next.js 16: Unit Testing & E2E dengan Playwright",
    "category": "Optimization & Deploy",
    "videoId": "I1V9YWqRIeI",
    "duration": "28:00",
    "description": "Pengujian otomatis komponen dengan Vitest / React Testing Library dan pengujian alur pengguna E2E dengan Playwright.",
    "keyTakeaways": [
      "Unit testing komponen UI & Server Actions dengan Vitest",
      "End-to-End (E2E) testing simulasi browser nyata dengan Playwright",
      "Menjalankan test otomatis di CI/CD GitHub Actions"
    ],
    "fullArticle": `
            <div class="article-section">
                <h3>🧪 Strategi Pengujian Software</h3>
                <p>Memastikan setiap fitur pemesanan tiket event berjalan tanpa bug di lingkungan produksi melalui pengujian terautomasi.</p>
            </div>
    `,
    "codeSnippets": [
      {
        "lang": "ts",
        "title": "Playwright Test Spec",
        "code": "import { test, expect } from '@playwright/test';\ntest('should navigate to events', async ({ page }) => {\n  await page.goto('/');\n  await expect(page.locator('h1')).toContainText('Welcome');\n});"
      }
    ],
    "interactiveLab": `export default function Page() {
  return (
    <div style={{ padding: '15px' }}>
      <h3>🧪 Playwright Test Runner</h3>
      <div style={{ color: '#4ade80' }}>✓ [Chromium] e2e/booking.spec.ts (2.1s)</div>
      <div style={{ color: '#4ade80' }}>✓ [Firefox] e2e/booking.spec.ts (2.4s)</div>
    </div>
  );
}`,
    "quiz": [
      {
        "question": "Framework testing manakah yang disarankan resmi oleh Vercel untuk End-to-End (E2E) Testing aplikasi Next.js?",
        "options": [
          "Selenium v1",
          "Playwright",
          "JQuery Test",
          "PHPUnit"
        ],
        "answer": 1,
        "explanation": "Playwright adalah framework E2E terpopuler dan direkomendasikan untuk menguji aplikasi Next.js di berbagai jenis browser real."
      }
    ]
  },
  {
    "id": 23,
    "title": "23. Build, Dockerization & Production Deployment di Vercel",
    "category": "Optimization & Deploy",
    "videoId": "I1V9YWqRIeI",
    "duration": "32:30",
    "description": "Menyiapkan build produksi `npm run build`, membuat Standalone Docker Image, dan rilis otomatis di Vercel Cloud Platform.",
    "keyTakeaways": [
      "Perintah `npm run build` memvalidasi tipe TypeScript & menghasilkan bundle ter-optimasi",
      "Opsi `output: 'standalone'` di `next.config.ts` untuk pembuatan Docker Container super hemat (hanya ~100MB)",
      "Deployment Instant di Vercel dengan fitur Preview Deployments & Custom Domain"
    ],
    "fullArticle": `
            <div class="article-section">
                <h3>🚢 Panduan Rilis Aplikasi ke Production</h3>
                <p>Tahap akhir dari pengembangan Dev Event Platform adalah melakukan kompilasi build produksi dan mempublikasikannya ke cloud server.</p>

                <div class="callout callout-tip">
                    <strong>Fitur Standalone Build:</strong>
                    Dengan menambahkan <code>output: 'standalone'</code> pada file <code>next.config.ts</code>, Next.js hanya akan membungkus dependensi <code>node_modules</code> yang benar-benar digunakan, sehingga ukuran container image berkurang hingga 80%.
                </div>
            </div>

            <div class="article-section">
                <h3>💻 Konfigurasi Standalone & Dockerfile Minimal</h3>
                <div class="code-container">
                    <div class="code-header"><span>next.config.ts</span><button class="copy-btn" onclick="copyCode(this)">Copy</button></div>
                    <pre><code>import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone", // Wajib untuk Docker Deploy!
};

export default nextConfig;</code></pre>
                </div>
            </div>
    `,
    "codeSnippets": [
      {
        "lang": "dockerfile",
        "title": "Next.js Production Dockerfile",
        "code": "FROM node:22-alpine AS runner\nWORKDIR /app\nENV NODE_ENV=production\nCOPY .next/standalone ./\nCOPY .next/static ./.next/static\nCMD [\"node\", \"server.js\"]"
      }
    ],
    "interactiveLab": `export default function Page() {
  return (
    <div style={{ padding: '15px' }}>
      <h3>🚀 Production Deployment Ready</h3>
      <div>Build Output: <code>Standalone Bundle (node server.js)</code></div>
      <div style={{ color: '#4ade80', marginTop: '6px' }}>Status: Deployed to Vercel Edge Network 🎉</div>
    </div>
  );
}`,
    "quiz": [
      {
        "question": "Apakah kegunaan opsi `output: 'standalone'` pada `next.config.ts`?",
        "options": [
          "Untuk mematikan TypeScript",
          "Menghasilkan folder build mandiri yang hanya berisi dependensi yang dibutuhkan sehingga ukuran Docker Image menjadi sangat ringkas",
          "Membuat aplikasi berjalan tanpa koneksi internet",
          "Menghapus seluruh file CSS"
        ],
        "answer": 1,
        "explanation": "Opsi standalone mengisolasi hanya file node_modules yang terpakai sehingga container Docker siap rilis dengan footprint minimal."
      }
    ]
  }
];

// App State Management
let currentModuleId = 1;
let completedModules = new Set();
let bookmarkedModules = new Set();
let currentFilterCategory = "ALL";
let searchQuery = "";

// Initialize Application
document.addEventListener("DOMContentLoaded", () => {
  loadProgressFromStorage();
  renderSidebar();
  loadModule(currentModuleId);
  setupEventListeners();
});

// Load Progress from localStorage
function loadProgressFromStorage() {
  const savedCompleted = localStorage.getItem("nextjs_learning_completed");
  if (savedCompleted) {
    completedModules = new Set(JSON.parse(savedCompleted));
  }

  const savedBookmarks = localStorage.getItem("nextjs_learning_bookmarks");
  if (savedBookmarks) {
    bookmarkedModules = new Set(JSON.parse(savedBookmarks));
  }

  updateProgressBar();
}

// Save Progress to localStorage
function saveProgressToStorage() {
  localStorage.setItem("nextjs_learning_completed", JSON.stringify([...completedModules]));
  localStorage.setItem("nextjs_learning_bookmarks", JSON.stringify([...bookmarkedModules]));
  updateProgressBar();
}

// Update Top Progress Bar Widget
function updateProgressBar() {
  const total = modulesData.length;
  const count = completedModules.size;
  const percentage = Math.round((count / total) * 100);

  const progressBar = document.getElementById("progressBar");
  const progressText = document.getElementById("progressText");

  if (progressBar && progressText) {
    progressBar.style.width = `${percentage}%`;
    progressText.innerText = `${count} / ${total} Selesai (${percentage}%)`;
  }
}

// Reset All Progress
function resetAllProgress() {
  if (confirm("Apakah Anda yakin ingin mereset seluruh kemajuan belajar Next.js 16 Anda?")) {
    completedModules.clear();
    bookmarkedModules.clear();
    saveProgressToStorage();
    renderSidebar();
    loadModule(currentModuleId);
  }
}

// Event Listeners setup
function setupEventListeners() {
  const searchInput = document.getElementById("searchInput");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      searchQuery = e.target.value.toLowerCase().trim();
      renderSidebar();
    });
  }
}

// Filter Category
function filterCategory(cat) {
  currentFilterCategory = cat;

  const filterButtons = document.querySelectorAll(".category-pill");
  filterButtons.forEach(btn => {
    if (btn.innerText.includes(cat) || (cat === "ALL" && btn.innerText === "Semua")) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });

  renderSidebar();
}

// Render Sidebar Chapter Cards
function renderSidebar() {
  const container = document.getElementById("chapterListContainer");
  if (!container) return;

  container.innerHTML = "";

  const filtered = modulesData.filter(m => {
    const matchesCat = (currentFilterCategory === "ALL") || (m.category === currentFilterCategory);
    const matchesSearch = searchQuery === "" || 
      m.title.toLowerCase().includes(searchQuery) || 
      m.description.toLowerCase().includes(searchQuery) ||
      m.category.toLowerCase().includes(searchQuery);

    return matchesCat && matchesSearch;
  });

  if (filtered.length === 0) {
    container.innerHTML = `<div style="padding: 16px; color: var(--text-muted); font-size: 0.85rem; text-align: center;">Tidak ada modul yang cocok dengan pencarian "${searchQuery}".</div>`;
    return;
  }

  filtered.forEach(mod => {
    const card = document.createElement("div");
    card.className = `chapter-card ${mod.id === currentModuleId ? "active" : ""}`;
    card.onclick = () => loadModule(mod.id);

    const isDone = completedModules.has(mod.id);
    const isBookmarked = bookmarkedModules.has(mod.id);

    card.innerHTML = `
      <div class="chapter-card-header">
        <span class="chapter-card-num">MODUL #${String(mod.id).padStart(2, '0')}</span>
        <span class="badge badge-next" style="font-size:0.65rem;">${mod.category}</span>
      </div>
      <div class="chapter-card-title">${mod.title}</div>
      <div class="chapter-card-footer">
        <span>⏱️ ${mod.duration}</span>
        <div class="status-indicator">
          ${isBookmarked ? '<span>⭐</span>' : ''}
          <span class="status-dot ${isDone ? 'completed' : ''}"></span>
          <span>${isDone ? 'Selesai' : 'Belum'}</span>
        </div>
      </div>
    `;

    container.appendChild(card);
  });
}

// Load Selected Module Data
function loadModule(id) {
  currentModuleId = id;
  const mod = modulesData.find(m => m.id === id);
  if (!mod) return;

  renderSidebar();

  // Header Banner Info
  document.getElementById("chapterCategoryBadge").innerText = mod.category;
  document.getElementById("timestampText").innerText = mod.videoId;
  document.getElementById("chapterTitle").innerText = mod.title;
  document.getElementById("chapterDesc").innerText = mod.description;

  // Action Buttons state
  const bookmarkBtn = document.getElementById("bookmarkBtn");
  if (bookmarkBtn) {
    bookmarkBtn.innerText = bookmarkedModules.has(id) ? "⭐ Bookmarked" : "⭐ Bookmark";
    bookmarkBtn.className = `btn ${bookmarkedModules.has(id) ? "btn-primary" : "btn-secondary"}`;
  }

  const toggleCompletedBtn = document.getElementById("toggleCompletedBtn");
  if (toggleCompletedBtn) {
    toggleCompletedBtn.innerText = completedModules.has(id) ? "✅ Selesai (Klik Batal)" : "✅ Tandai Selesai";
  }

  // Render Article Body
  const articleBody = document.getElementById("articleBody");
  if (articleBody) {
    let keyTakeawaysHtml = mod.keyTakeaways ? `
      <div class="callout callout-tip" style="margin-bottom: 20px;">
        <strong>🎯 Poin-Poin Utama Modul Ini:</strong>
        <ul style="margin-top: 8px;">
          ${mod.keyTakeaways.map(k => `<li>${k.replace(/`([^`]+)`/g, (_, code) => "<code>" + code.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;") + "</code>")}</li>`).join("")}
        </ul>
      </div>
    ` : "";

    articleBody.innerHTML = keyTakeawaysHtml + mod.fullArticle;
  }

  // Setup Video Tab
  kodelokaVideo(mod.videoId);

  // Setup Playground Tab
  loadPlaygroundSnippets(mod);

  // Setup Quiz Tab
  renderQuiz(mod);

  // Setup Notes Tab
  loadUserNote(id);

  // Footer Navigation Progress
  document.getElementById("currentFooterProgress").innerText = `Modul ${id} dari ${modulesData.length}`;

  // Scroll to top of main content
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Toggle Current Module Bookmark
function toggleBookmark() {
  if (bookmarkedModules.has(currentModuleId)) {
    bookmarkedModules.delete(currentModuleId);
  } else {
    bookmarkedModules.add(currentModuleId);
  }
  saveProgressToStorage();
  loadModule(currentModuleId);
}

// Toggle Current Module Completed
function toggleCurrentCompleted() {
  if (completedModules.has(currentModuleId)) {
    completedModules.delete(currentModuleId);
  } else {
    completedModules.add(currentModuleId);
  }
  saveProgressToStorage();
  loadModule(currentModuleId);
}

// Tab Switching Mechanism
function switchTab(tabName) {
  const tabBtns = document.querySelectorAll(".tab-btn");
  const tabPanels = document.querySelectorAll(".tab-panel");

  tabBtns.forEach(btn => {
    if (btn.getAttribute("data-tab") === tabName) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });

  tabPanels.forEach(panel => {
    if (panel.id === `tab-${tabName}`) {
      panel.classList.add("active");
    } else {
      panel.classList.remove("active");
    }
  });
}

// Playground & Code Snippets Setup
function loadPlaygroundSnippets(mod) {
  const snippetGrid = document.getElementById("snippetButtonsGrid");
  const editor = document.getElementById("playgroundEditor");

  if (snippetGrid) {
    snippetGrid.innerHTML = "";
    if (mod.codeSnippets && mod.codeSnippets.length > 0) {
      mod.codeSnippets.forEach(snip => {
        const btn = document.createElement("button");
        btn.className = "btn-snippet";
        btn.innerText = snip.title;
        btn.onclick = () => {
          if (editor) editor.value = snip.code;
        };
        snippetGrid.appendChild(btn);
      });
    } else {
      snippetGrid.innerHTML = `<span style="font-size:0.8rem; color:var(--text-muted);">Tidak ada templat tambahan.</span>`;
    }
  }

  if (editor) {
    editor.value = mod.interactiveLab || `export default function Page() {\n  return <h1>Hello Next.js 16</h1>;\n}`;
  }

  runNextjsSimulation();
}

function loadSampleCode() {
  const mod = modulesData.find(m => m.id === currentModuleId);
  if (mod) loadPlaygroundSnippets(mod);
}

function clearPlayground() {
  const editor = document.getElementById("playgroundEditor");
  if (editor) editor.value = "";
}

// Run Simulated Next.js Compilation & Render
function runNextjsSimulation() {
  const editor = document.getElementById("playgroundEditor");
  const uiPreview = document.getElementById("renderedUIPreview");
  const termOutput = document.getElementById("terminalOutput");

  if (!editor || !uiPreview || !termOutput) return;

  const code = editor.value;

  // Update Server Terminal Logs
  const timestamp = new Date().toLocaleTimeString();
  termOutput.innerHTML = `
    <div class="term-line term-info">[${timestamp}] GET / 200 in ${Math.floor(Math.random() * 45 + 10)}ms (Turbopack)</div>
    <div class="term-line term-success">✓ Compiled /app/page.tsx successfully</div>
    <div class="term-line term-info">Server Component rendered -> Sent HTML Stream to Client</div>
  `;

  // Render Simulated UI Component
  try {
    if (code.includes("use client")) {
      uiPreview.innerHTML = `
        <div style="border: 1px dashed var(--next-cyan); padding: 12px; border-radius: 8px;">
          <span style="font-size:0.75rem; background: rgba(0,223,216,0.15); color: var(--next-cyan); padding: 2px 6px; border-radius: 4px;">Client Component Boundary</span>
          <div style="margin-top: 10px;">${code.replace(/"use client";|'use client';/g, '')}</div>
        </div>
      `;
    } else {
      uiPreview.innerHTML = `
        <div style="border: 1px solid var(--next-border); padding: 12px; border-radius: 8px; background: rgba(0,112,243,0.05);">
          <span style="font-size:0.75rem; background: rgba(0,112,243,0.2); color: #93c5fd; padding: 2px 6px; border-radius: 4px;">React Server Component (RSC)</span>
          <div style="margin-top: 10px;">${code}</div>
        </div>
      `;
    }
  } catch (err) {
    uiPreview.innerHTML = `<div style="color: var(--error-color);">Error rendering component preview: ${err.message}</div>`;
  }
}

function clearTerminalOutput() {
  const termOutput = document.getElementById("terminalOutput");
  if (termOutput) termOutput.innerHTML = `<div class="term-line term-info">Terminal log cleared.</div>`;
}

// Render Quiz Questions
function renderQuiz(mod) {
  const quizContainer = document.getElementById("quizContainer");
  if (!quizContainer) return;

  if (!mod.quiz || mod.quiz.length === 0) {
    quizContainer.innerHTML = `<div style="padding: 20px; color: var(--text-muted);">Tidak ada soal quiz untuk modul ini.</div>`;
    return;
  }

  quizContainer.innerHTML = `
    <h3 style="font-size: 1.2rem; font-weight: 800; border-bottom: 1px solid var(--next-border); padding-bottom: 8px;">
      🧪 Quiz Pemahaman Modul #${String(mod.id).padStart(2, '0')}
    </h3>
  `;

  mod.quiz.forEach((q, index) => {
    const card = document.createElement("div");
    card.className = "quiz-card";

    const questionTitle = document.createElement("div");
    questionTitle.className = "quiz-question";
    questionTitle.innerText = `${index + 1}. ${q.question}`;
    card.appendChild(questionTitle);

    const optionsBox = document.createElement("div");
    optionsBox.className = "quiz-options";

    const explanationBox = document.createElement("div");
    explanationBox.className = "quiz-explanation";
    explanationBox.innerText = `💡 Penjelasan: ${q.explanation}`;

    q.options.forEach((optText, optIdx) => {
      const optBtn = document.createElement("div");
      optBtn.className = "quiz-option";
      optBtn.innerHTML = `<strong>${String.fromCharCode(65 + optIdx)}.</strong> ${optText}`;

      optBtn.onclick = () => {
        // Clear previous selections for this question
        const allOpts = optionsBox.querySelectorAll(".quiz-option");
        allOpts.forEach(o => o.className = "quiz-option");

        if (optIdx === q.answer) {
          optBtn.classList.add("correct");
        } else {
          optBtn.classList.add("incorrect");
          // highlight correct one
          allOpts[q.answer].classList.add("correct");
        }

        explanationBox.style.display = "block";
      };

      optionsBox.appendChild(optBtn);
    });

    card.appendChild(optionsBox);
    card.appendChild(explanationBox);
    quizContainer.appendChild(card);
  });
}

// Notes Section Storage
function loadUserNote(modId) {
  const notesTextarea = document.getElementById("notesTextarea");
  if (!notesTextarea) return;

  const savedNote = localStorage.getItem(`nextjs_note_${modId}`) || "";
  notesTextarea.value = savedNote;
}

function saveUserNote() {
  const notesTextarea = document.getElementById("notesTextarea");
  const saveStatus = document.getElementById("saveNotesStatus");
  if (!notesTextarea) return;

  localStorage.setItem(`nextjs_note_${currentModuleId}`, notesTextarea.value);

  if (saveStatus) {
    saveStatus.style.display = "inline";
    setTimeout(() => {
      saveStatus.style.display = "none";
    }, 2000);
  }
}

// Navigation Controls
function navigatePrev() {
  if (currentModuleId > 1) {
    loadModule(currentModuleId - 1);
  }
}

function navigateNext() {
  if (currentModuleId < modulesData.length) {
    loadModule(currentModuleId + 1);
  }
}

// Code Copy Helper
function copyCode(btn) {
  const codeBlock = btn.parentElement.nextElementSibling.querySelector("code");
  if (codeBlock) {
    navigator.clipboard.writeText(codeBlock.innerText);
    const origText = btn.innerText;
    btn.innerText = "Copied!";
    setTimeout(() => btn.innerText = origText, 1500);
  }
}

// Final Certification Exam Modal Engine
function openFinalExam() {
  const modal = document.getElementById("examModal");
  const body = document.getElementById("examModalBody");
  if (!modal || !body) return;

  // Generate 10 randomized exam questions from module quizzes
  const allQuizzes = [];
  modulesData.forEach(m => {
    if (m.quiz) {
      m.quiz.forEach(q => {
        allQuizzes.push({ ...q, modTitle: m.title });
      });
    }
  });

  const selectedQuestions = allQuizzes.sort(() => 0.5 - Math.random()).slice(0, 10);
  let userAnswers = new Array(selectedQuestions.length).fill(null);

  body.innerHTML = `
    <h2 style="font-size: 1.5rem; font-weight: 800; color: var(--next-blue); margin-bottom: 12px;">
      🏆 Ujian Sertifikasi Next.js 16 Full-Stack Developer
    </h2>
    <p style="color: var(--text-secondary); font-size: 0.9rem; margin-bottom: 20px;">
      Jawab 10 soal di bawah ini dengan benar untuk menguji pemahaman komprehensif Anda tentang Next.js 16 App Router, React 19, Server Actions, & Caching. (Batas Kelulusan: 80%)
    </p>

    <div id="examQuestionsList" style="display: flex; flex-direction: column; gap: 20px;">
      ${selectedQuestions.map((q, idx) => `
        <div class="quiz-card">
          <div style="font-size:0.75rem; color:var(--next-cyan); font-family:var(--font-mono);">${q.modTitle}</div>
          <div class="quiz-question">${idx + 1}. ${q.question}</div>
          <div class="quiz-options">
            ${q.options.map((opt, optIdx) => `
              <div class="quiz-option" onclick="selectExamAnswer(${idx}, ${optIdx}, this)">
                <strong>${String.fromCharCode(65 + optIdx)}.</strong> ${opt}
              </div>
            `).join("")}
          </div>
        </div>
      `).join("")}
    </div>

    <div style="margin-top: 24px; text-align: right;">
      <button class="btn btn-primary" onclick="submitFinalExam(${JSON.stringify(selectedQuestions).replace(/"/g, '&quot;')})">
        🚀 Kirim Jawaban Ujian
      </button>
    </div>
  `;

  modal.classList.add("active");
}

let examUserAnswers = [];

function selectExamAnswer(qIdx, optIdx, element) {
  const parent = element.parentElement;
  parent.querySelectorAll(".quiz-option").forEach(el => el.classList.remove("selected"));
  element.classList.add("selected");
  examUserAnswers[qIdx] = optIdx;
}

function submitFinalExam(questions) {
  let score = 0;
  questions.forEach((q, idx) => {
    if (examUserAnswers[idx] === q.answer) {
      score++;
    }
  });

  const percentage = Math.round((score / questions.length) * 100);
  const isPassed = percentage >= 80;

  const body = document.getElementById("examModalBody");
  if (!body) return;

  body.innerHTML = `
    <div style="text-align: center; padding: 20px 0;">
      <div style="font-size: 3rem; margin-bottom: 12px;">${isPassed ? '🎉' : '❌'}</div>
      <h2 style="font-size: 1.8rem; font-weight: 900; color: ${isPassed ? 'var(--success-color)' : 'var(--error-color)'};">
        ${isPassed ? 'Selamat! Anda Lulus Ujian Sertifikasi Next.js 16' : 'Maaf, Anda Belum Lulus'}
      </h2>
      <div style="font-size: 2.5rem; font-weight: 900; margin: 16px 0; color: #ffffff;">
        Skor Anda: ${percentage}% (${score} / ${questions.length} Benar)
      </div>
      <p style="color: var(--text-secondary); max-width: 500px; margin: 0 auto 24px auto;">
        ${isPassed 
          ? 'Anda telah menguasai seluruh konsep Next.js 16 App Router, React 19 Server Components, Server Actions, dan Caching Strategy dengan sangat baik.' 
          : 'Batas nilai kelulusan adalah 80%. Pelajari kembali modul-modul yang belum Anda pahami dan coba ujian kembali.'}
      </p>

      <div style="display: flex; justify-content: center; gap: 12px;">
        <button class="btn btn-secondary" onclick="openFinalExam()">🔄 Coba Ulang Ujian</button>
        <button class="btn btn-primary" onclick="closeFinalExam()">Tutup Window</button>
      </div>
    </div>
  `;
}

function closeFinalExam() {
  const modal = document.getElementById("examModal");
  if (modal) modal.classList.remove("active");
}
