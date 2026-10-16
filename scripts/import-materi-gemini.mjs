// Turns the Markdown lessons in materi-gemini/<kelas>/ into a Kodeloka course that runs on the shared
// "linux" engine: writes <kelas>/app.js (MODUL + the engine copied verbatim from linux/app.js), and
// creates <kelas>/index.html and <kelas>/style.css from the linux course the first time.
// Order and sidebar categories come from scripts/materi-gemini-kelas.json.
//
//   node scripts/import-materi-gemini.mjs            all classes in the config
//   node scripts/import-materi-gemini.mjs html css   only these
//
// After running it: npm run extract && npm test.
import { readFile, writeFile, readdir, mkdir, access } from 'node:fs/promises';
import { join } from 'node:path';

const root = new URL('..', import.meta.url).pathname;
const config = JSON.parse(await readFile(join(root, 'scripts/materi-gemini-kelas.json'), 'utf8'));
const wanted = process.argv.slice(2).length ? process.argv.slice(2) : Object.keys(config);

const linuxApp = await readFile(join(root, 'linux/app.js'), 'utf8');
const engineAt = linuxApp.search(/^\/\* =+\n {3}ENGINE PEMBELAJARAN/m);
if (engineAt < 0) throw new Error('linux/app.js: engine marker not found');
const ENGINE = linuxApp.slice(engineAt);

// ---------- Markdown (the subset Gemini uses) -> HTML ----------
// Quotes are escaped too, so code such as href="…" is never mistaken for a real link by the link checker.
const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const escAttr = esc;

function inline(text) {
  const codes = [];
  let s = text.replace(/`([^`]+)`/g, (_, c) => `\u0000${codes.push(c) - 1}\u0000`);
  s = esc(s);
  s = s.replace(/\[([^\]]+)\]\((https?:[^)\s]+)\)/g, (_, t, u) => `<a href="${escAttr(u)}" rel="noopener">${t}</a>`);
  s = s.replace(/\*\*([^*]+?)\*\*/g, '<strong>$1</strong>');
  s = s.replace(/(^|[^*\w])\*([^*\s][^*]*?)\*(?!\w)/g, '$1<em>$2</em>');
  return s.replace(/\u0000(\d+)\u0000/g, (_, i) => `<code>${esc(codes[i])}</code>`);
}

// Plain text for quiz fields (the engine escapes them itself).
const plain = text => text.replace(/\*\*([^*]+?)\*\*/g, '$1').replace(/(^|[^*\w])\*([^*\s][^*]*?)\*(?!\w)/g, '$1$2').replace(/`([^`]+)`/g, '$1').replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').trim();

const CALLOUT = { '💡': 'info', 'ℹ️': 'info', '📌': 'info', '✅': 'info', '⚠️': 'waspada', '⚠': 'waspada', '🚫': 'bahaya', '❌': 'bahaya', '🛑': 'bahaya' };

function blocks(lines) {
  const out = [];
  let i = 0;
  const isBlockStart = l => /^(#{2,4} |```|\||>|\s*[-*] |\s*\d+\. )/.test(l) || l.trim() === '';
  while (i < lines.length) {
    const line = lines[i];
    if (line.trim() === '') { i++; continue; }
    let m;
    if ((m = line.match(/^(#{2,4}) (.*)$/))) {
      const level = Math.max(2, m[1].length);
      out.push(`<h${level}>${inline(m[2])}</h${level}>`);
      i++;
    } else if (line.startsWith('```')) {
      const body = [];
      i++;
      while (i < lines.length && !lines[i].startsWith('```')) body.push(lines[i++]);
      i++;
      out.push(`<pre>${esc(body.join('\n'))}</pre>`);
    } else if (line.startsWith('|')) {
      const rows = [];
      while (i < lines.length && lines[i].startsWith('|')) rows.push(lines[i++]);
      const cells = r => r.trim().replace(/^\||\|$/g, '').split(/(?<!\\)\|/).map(c => inline(c.trim().replace(/\\\|/g, '|')));
      const body = rows.filter((r, k) => !(k === 1 && /^\|[\s:|-]+\|?$/.test(r.trim())));
      const [head, ...rest] = body;
      out.push(`<table><thead><tr>${cells(head).map(c => `<th>${c}</th>`).join('')}</tr></thead><tbody>${rest.map(r => `<tr>${cells(r).map(c => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table>`);
    } else if (line.startsWith('>')) {
      const body = [];
      while (i < lines.length && lines[i].startsWith('>')) body.push(lines[i++].replace(/^> ?/, ''));
      out.push(callout(body));
    } else if (/^\s*([-*]|\d+\.) /.test(line)) {
      const items = [];
      while (i < lines.length && (/^\s*([-*]|\d+\.) /.test(lines[i]) || (/^\s{2,}\S/.test(lines[i]) && items.length))) items.push(lines[i++]);
      out.push(list(items));
    } else {
      const para = [];
      while (i < lines.length && !isBlockStart(lines[i])) para.push(lines[i++].trim());
      if (!para.length) para.push(lines[i++].trim());
      out.push(`<p>${inline(para.join(' '))}</p>`);
    }
  }
  return out.join('\n');
}

function list(items) {
  const indent = l => l.match(/^\s*/)[0].length;
  const base = indent(items[0]);
  const ordered = /^\s*\d+\. /.test(items[0]);
  const lis = [];
  for (let k = 0; k < items.length; k++) {
    const l = items[k];
    if (indent(l) > base) {
      const sub = [];
      while (k < items.length && indent(items[k]) > base) sub.push(items[k++]);
      k--;
      const last = lis.length - 1;
      if (last >= 0 && sub.some(s => /^\s*([-*]|\d+\.) /.test(s))) lis[last] = lis[last].replace(/<\/li>$/, `${list(sub)}</li>`);
      else if (last >= 0) lis[last] = lis[last].replace(/<\/li>$/, ` ${inline(sub.map(s => s.trim()).join(' '))}</li>`);
      continue;
    }
    lis.push(`<li>${inline(l.replace(/^\s*([-*]|\d+\.) /, ''))}</li>`);
  }
  return ordered ? `<ol>${lis.join('')}</ol>` : `<ul>${lis.join('')}</ul>`;
}

function callout(body) {
  const first = body[0] || '';
  const m = first.match(/^\*\*\s*(\S+)\s+([^*]+?):?\*\*:?\s*(.*)$/);
  let kind = 'info', title = '', rest = body;
  if (m && CALLOUT[m[1]]) {
    kind = CALLOUT[m[1]];
    title = `${m[1]} ${m[2].replace(/:$/, '')}`;
    rest = [m[3], ...body.slice(1)];
  } else if (/^\*\*\s*Perlu dicek/i.test(first)) {
    kind = 'waspada';
  }
  const inner = blocks(rest);
  return `<div class="callout ${kind}">${title ? `<div class="callout-judul">${inline(title)}</div>` : ''}${inner}</div>`;
}

// ---------- one lesson ----------
function lesson(md, file) {
  const lines = md.replace(/\r\n/g, '\n').split('\n');
  const judul = lines[0].replace(/^# /, '').trim();
  if (!lines[0].startsWith('# ')) throw new Error(`${file}: first line must be "# <judul>"`);
  const meta = k => (md.match(new RegExp(`^- \\*\\*${k}:\\*\\*\\s*(.+)$`, 'm')) || [])[1]?.trim();
  const tingkat = meta('Tingkat');
  const ringkas = meta('Ringkasan');
  if (!['Dasar', 'Menengah', 'Lanjut'].includes(tingkat)) throw new Error(`${file}: Tingkat "${tingkat}"`);
  if (!ringkas) throw new Error(`${file}: Ringkasan missing`);

  const at = h => lines.findIndex(l => l.trim() === h);
  const kuisAt = at('## Kuis Pemahaman');
  const sumberAt = at('## Sumber');
  if (kuisAt < 0 || sumberAt < 0 || sumberAt < kuisAt) throw new Error(`${file}: needs "## Kuis Pemahaman" before "## Sumber"`);
  const start = lines.findIndex((l, k) => k > 0 && l.startsWith('## '));
  const body = lines.slice(start, kuisAt).filter((l, k, all) => true);

  // Drop integration notes meant for Claude, not for learners.
  const kept = [];
  for (let k = 0; k < body.length; k++) {
    if (/^> \*\*💡 Catatan Integrasi/.test(body[k])) { while (k < body.length && body[k].startsWith('>')) k++; continue; }
    kept.push(body[k]);
  }

  // Quiz
  const kuis = [];
  const quizLines = lines.slice(kuisAt + 1, sumberAt);
  const parts = quizLines.join('\n').split(/^### Soal \d+\s*$/m).slice(1);
  for (const p of parts) {
    const ls = p.split('\n');
    const opsi = [], tanya = [];
    let benar = null, penjelasan = '';
    for (const l of ls) {
      let m;
      if ((m = l.match(/^- ([A-D])\. (.*)$/))) opsi.push(plain(m[2]));
      else if ((m = l.match(/^\*\*Jawaban Benar:\*\*\s*([A-D])/))) benar = 'ABCD'.indexOf(m[1]);
      else if ((m = l.match(/^\*\*Penjelasan:\*\*\s*(.*)$/))) penjelasan = plain(m[1]);
      else if (penjelasan && l.trim()) penjelasan += ' ' + plain(l);
      else if (!opsi.length && l.trim()) tanya.push(plain(l));
    }
    if (opsi.length !== 4 || benar === null || benar < 0 || !penjelasan || !tanya.length) throw new Error(`${file}: malformed quiz item`);
    kuis.push({ tanya: tanya.join(' '), opsi, benar, penjelasan });
  }
  if (kuis.length < 2) throw new Error(`${file}: fewer than 2 quiz items`);

  // Sources -> "Rujukan resmi" callout
  const links = lines.slice(sumberAt + 1).map(l => l.match(/^\s*[-*] \[(.+?)\]\((https?:[^)\s]+)\)/)).filter(Boolean);
  if (!links.length) throw new Error(`${file}: no sources`);
  const rujukan = `<div class="callout info"><div class="callout-judul">📚 Rujukan</div><ul>${links.map(([, t, u]) => `<li><a href="${escAttr(u)}" rel="noopener">${inline(t)}</a></li>`).join('')}</ul></div>`;

  const isi = `${blocks(kept)}\n${rujukan}`;

  // Commands: the most frequent short inline code in the prose.
  const freq = new Map();
  for (const l of kept) {
    if (l.startsWith('```')) continue;
    for (const [, c] of l.matchAll(/`([^`\n]{1,40})`/g)) freq.set(c, (freq.get(c) || 0) + 1);
  }
  const perintah = [...freq.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6).map(([c]) => c);
  const tag = [...new Set([...judul.matchAll(/`([^`]+)`/g)].map(m => m[1]))].slice(0, 3);
  for (const c of perintah) if (tag.length < 3 && !tag.includes(c)) tag.push(c);

  const words = kept.join(' ').replace(/[`#*|>-]/g, ' ').split(/\s+/).filter(Boolean).length;
  const durasi = `${Math.max(5, Math.round(words / 200) + 5)} mnt`;
  // The engine writes judul into the sidebar unescaped, so element names lose their angle brackets.
  return { judul: plain(judul).replace(/[<>]/g, ''), tingkat, durasi, tag, ringkas: plain(ringkas), isi, perintah, kuis };
}

// ---------- write a course ----------
const tl = s => s.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\${');
const js = v => JSON.stringify(v);

for (const slug of wanted) {
  const c = config[slug];
  if (!c) throw new Error(`unknown class ${slug}`);
  const dir = join(root, 'materi-gemini', slug);
  const files = (await readdir(dir)).filter(f => /^\d{2}-.*\.md$/.test(f)).sort();
  const byNo = new Map(files.map(f => [f.slice(0, 2), f]));
  // "tunda": lessons kept in materi-gemini/ but not published yet (see "tunda_alasan").
  const tunda = new Set(c.tunda || []);
  const all = c.kategori.flatMap(([, nos]) => nos);
  const groups = c.kategori.map(([nama, nos]) => [nama, nos.filter(no => !tunda.has(no))]).filter(([, nos]) => nos.length);
  const order = groups.flatMap(([nama, nos], gi) => nos.map(no => ({ no, kategori: `${gi + 1} · ${nama}` })));
  const listed = new Set(all);
  const missing = [...byNo.keys()].filter(n => !listed.has(n));
  const unknown = all.filter(no => !byNo.has(no));
  const unknownTunda = [...tunda].filter(no => !listed.has(no));
  if (missing.length || unknown.length || unknownTunda.length || listed.size !== all.length) throw new Error(`${slug}: config/files mismatch; missing ${missing}, unknown ${unknown}`);

  const modul = [];
  for (const [k, o] of order.entries()) {
    const file = byNo.get(o.no);
    const l = lesson(await readFile(join(dir, file), 'utf8'), `${slug}/${file}`);
    modul.push(`{
    id: ${k + 1},
    kategori: ${js(o.kategori)},
    judul: ${js(l.judul)},
    tingkat: ${js(l.tingkat)}, durasi: ${js(l.durasi)},
    tag: ${js(l.tag)},
    ringkas: ${js(l.ringkas)},
    isi: \`
${tl(l.isi)}
\`,
    perintah: ${js(l.perintah)},
    kuis: [
${l.kuis.map(q => `        ${js(q)}`).join(',\n')}
    ]
}`);
  }

  const app = `/* ==========================================================================
   ${c.nama.toUpperCase()} — Platform Pembelajaran Interaktif
   Materi: riset Gemini (materi-gemini/${slug}/), dikoreksi dan disusun oleh Claude Code.
   Dihasilkan oleh scripts/import-materi-gemini.mjs; ubah Markdown-nya, bukan berkas ini.
   ========================================================================== */

const TOPIK_SLUG = ${js(slug)};
const TOPIK_SUB  = ${js(c.sub)};

const MODUL = [
${modul.join(',\n')}
];

${ENGINE}`;
  await mkdir(join(root, slug), { recursive: true });
  await writeFile(join(root, slug, 'app.js'), app);

  const exists = async p => access(p).then(() => true, () => false);
  const extraCss = `
/* Materi Gemini: tabel lebar digulir di dalam artikel, kode sebaris boleh patah di layar sempit. */
.artikel table { display: block; max-width: 100%; overflow-x: auto; }
.artikel :not(pre) > code { overflow-wrap: anywhere; }
`;
  if (!(await exists(join(root, slug, 'style.css')))) await writeFile(join(root, slug, 'style.css'), (await readFile(join(root, 'linux/style.css'), 'utf8')) + extraCss);
  if (!(await exists(join(root, slug, 'index.html')))) {
    const html = (await readFile(join(root, 'linux/index.html'), 'utf8'))
      .replace(/<title>[^<]*<\/title>/, `<title>${esc(c.title || c.nama)} | Kodeloka</title>`)
      .replace(/<meta name="description" content="[^"]*">/, `<meta name="description" content="${escAttr(c.description || c.tagline)}">`)
      .replace('Ruang belajar / Linux', `Ruang belajar / ${esc(c.nama)}`)
      .replace('<div class="merek-ikon">🐧</div>', `<div class="merek-ikon">${c.ikon}</div>`)
      .replace('<span>Linux & Shell</span>', `<span>${esc(c.nama)}</span>`)
      .replace('Fondasi sistem untuk semua topik lain', esc(c.tagline));
    await writeFile(join(root, slug, 'index.html'), html);
  }
  console.log(`${slug}: ${modul.length} modul in ${groups.length} kategori, ${tunda.size} ditunda`);
}
