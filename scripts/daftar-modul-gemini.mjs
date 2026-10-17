// Writes materi-gemini/DAFTAR-MODUL.md: every module of every course with its word count and page,
// so Gemini can see what each class already covers and which explanations are thin.
// Reads data/modules.json, so run npm run extract first when course content has changed.
//
//   node scripts/daftar-modul-gemini.mjs
import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const root = new URL('..', import.meta.url).pathname;
const SITE = 'https://kodeloka.asadinedu.com';
const THIN = 300;

const courses = JSON.parse(await readFile(join(root, 'scripts/courses.json'), 'utf8'));
const extracted = new Map(JSON.parse(await readFile(join(root, 'data/modules.json'), 'utf8')).map(c => [c.slug, c.modules]));

// Same page slugs as scripts/build.mjs.
const slugify = s => s.normalize('NFKD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/&/g, ' dan ').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 72).replace(/-+$/, '');
const stripNumber = t => t.replace(/^\d+\.\s*/, '');
const cell = s => String(s).replace(/\|/g, '\\|').replace(/\s+/g, ' ').trim();
const median = xs => [...xs].sort((a, b) => a - b)[Math.floor(xs.length / 2)];

function pagesFor(slug, modules) {
  if (slug === 'golang') return modules.map(m => `${SITE}/golang/materi/${slugify(m.category)}/`);
  const used = new Set();
  return modules.map((m, i) => {
    let s = `${String(i + 1).padStart(2, '0')}-${slugify(stripNumber(m.title))}`;
    while (used.has(s)) s += '-2';
    used.add(s);
    return `${SITE}/${slug}/materi/${s}/`;
  });
}

const rows = courses.map(c => {
  const modules = extracted.get(c.slug);
  const words = modules.map(m => m.words);
  return { ...c, modules, pages: pagesFor(c.slug, modules), median: median(words), thin: words.filter(w => w < THIN).length };
});

const today = new Date().toISOString().slice(0, 10);
const out = [];
out.push(`# Daftar modul Kodeloka

Dibuat otomatis oleh \`scripts/daftar-modul-gemini.mjs\` dari \`data/modules.json\` pada ${today}. Jangan disunting; Claude membuatnya ulang setiap kali materi di situs berubah.

- **Kata** adalah jumlah kata di tab Materi, seperti yang dibaca pelajar. Kode di editor praktik tidak ikut dihitung.
- **tipis** berarti kurang dari ${THIN} kata. Ini hanya petunjuk awal: modul yang panjang pun bisa punya penjelasan yang kurang.
- **No** adalah nomor modul yang dipakai untuk nama berkas perbaikan (\`materi-gemini/perbaikan/<folder>/NNN-judul.md\`).
- Isi asli setiap kelas ada di \`<folder>/app.js\`. Kelas HTML, CSS, JavaScript, dan PHP dibuat dari \`materi-gemini/<kelas>/\`, jadi perbaiki berkas Markdown-nya langsung.
- Golang menampilkan semua bab satu domain di satu halaman, jadi beberapa bab berbagi tautan yang sama.

## Ringkasan

| Kelas | Folder | Modul | Median kata | Modul tipis |
| :--- | :--- | ---: | ---: | ---: |
${[...rows].sort((a, b) => a.median - b.median).map(r => `| ${cell(r.name)} | \`${r.slug}/\` | ${r.modules.length} | ${r.median} | ${r.thin} |`).join('\n')}
| **Total** | | **${rows.reduce((n, r) => n + r.modules.length, 0)}** | | **${rows.reduce((n, r) => n + r.thin, 0)}** |
`);

for (const r of rows) {
  out.push(`## ${r.name} (\`${r.slug}/\`, ${r.modules.length} modul)

| No | Judul | Kategori | Kata | Halaman |
| ---: | :--- | :--- | ---: | :--- |
${r.modules.map((m, i) => `| ${i + 1} | ${cell(stripNumber(m.title))} | ${cell(m.category)} | ${m.words}${m.words < THIN ? ' **tipis**' : ''} | ${r.pages[i]} |`).join('\n')}
`);
}

await writeFile(join(root, 'materi-gemini/DAFTAR-MODUL.md'), out.join('\n'));
console.log('materi-gemini/DAFTAR-MODUL.md:', rows.reduce((n, r) => n + r.modules.length, 0), 'modul,', rows.reduce((n, r) => n + r.thin, 0), 'tipis');
