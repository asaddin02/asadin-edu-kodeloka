// Builds dist/ for Cloudflare Pages: copies the site, adds search metadata to every page, ships the
// home catalog as HTML, writes one article page per module (Golang: one per domain, because its
// chapters are short), and writes sitemap.xml, robots.txt, 404.html, _headers and the web manifest.
// No dependencies; data/modules.json and data/catalog.json come from `npm run extract`.
import { readFile, writeFile, mkdir, cp, rm } from 'node:fs/promises';
import { join } from 'node:path';

const root = new URL('..', import.meta.url).pathname;
const dist = join(root, 'dist');
const SITE = (process.env.SITE_URL || 'https://kodeloka.asadinedu.com').replace(/\/+$/, '');
const VERIFY = (process.env.GOOGLE_SITE_VERIFICATION || '').match(/[\w-]{20,100}/)?.[0] || '';
const TODAY = process.env.BUILD_DATE || new Date().toISOString().slice(0, 10);
const ORG = { '@type': 'Organization', '@id': 'https://asadinedu.com/#organization', name: 'Asadin Edu', url: 'https://asadinedu.com/' };
const OG_IMAGE = SITE + '/assets/brand/og-image.png';

const courses = JSON.parse(await readFile(join(root, 'scripts/courses.json'), 'utf8'));
const extracted = new Map(JSON.parse(await readFile(join(root, 'data/modules.json'), 'utf8')).map(c => [c.slug, c.modules]));
const catalog = JSON.parse(await readFile(join(root, 'data/catalog.json'), 'utf8'));

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const clip = (s, n = 158) => (s.length <= n ? s : s.slice(0, s.lastIndexOf(' ', n - 1)).replace(/[,;:.\s]+$/, '') + '…');
const plain = html => html.replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/\s+/g, ' ').trim();
const slugify = s => s.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/&/g, ' dan ').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 72).replace(/-+$/, '');
const stripNumber = t => t.replace(/^\d+\.\s*/, '');
const jsonLd = data => `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`;

for (const c of courses) {
  if (!extracted.has(c.slug)) throw new Error(`data/modules.json has no course ${c.slug}; run npm run extract`);
}

// One article unit per module, except Golang: its 267 chapters are a few sentences each, so each of its
// 27 domains becomes one page that carries all of its chapters and their starter programs.
function unitsFor(course) {
  const modules = extracted.get(course.slug);
  if (course.slug === 'golang') {
    const units = [];
    modules.forEach((m, i) => {
      let unit = units.at(-1);
      if (!unit || unit.category !== m.category) {
        const match = /^Domain (\d+):\s*(.+)$/.exec(m.category);
        unit = { category: m.category, title: match ? match[2] : m.category, eyebrow: match ? `Domain ${match[1]}` : 'Golang', slug: slugify(m.category), start: i + 1, chapters: [] };
        units.push(unit);
      }
      unit.chapters.push({ ...m, n: i + 1 });
    });
    for (const u of units) u.summary = `${u.chapters.length} bab: ${u.chapters.map(ch => stripNumber(ch.title)).join(', ')}.`;
    return units;
  }
  const used = new Set();
  return modules.map((m, i) => {
    let slug = `${String(i + 1).padStart(2, '0')}-${slugify(stripNumber(m.title))}`;
    while (used.has(slug)) slug += '-2';
    used.add(slug);
    return { category: m.category, title: stripNumber(m.title), eyebrow: m.category || `Modul ${i + 1}`, slug, start: i + 1, summary: m.summary, chapters: [{ ...m, n: i + 1 }] };
  });
}

function head({ title, description, path, type = 'website', image = OG_IMAGE, ld, extra = '' }) {
  const url = SITE + path;
  return `<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${url}">
<meta property="og:type" content="${type}">
<meta property="og:site_name" content="Kodeloka">
<meta property="og:locale" content="id_ID">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${image}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#f7f3eb">
<link rel="icon" href="/assets/brand/kodeloka-mark.svg" type="image/svg+xml">
<link rel="icon" href="/assets/brand/icon-192.png" type="image/png" sizes="192x192">
<link rel="apple-touch-icon" href="/assets/brand/apple-touch-icon.png">
<link rel="manifest" href="/manifest.webmanifest">${VERIFY ? `\n<meta name="google-site-verification" content="${VERIFY}">` : ''}
${extra}${ld ? jsonLd(ld) : ''}`;
}

const crumbList = items => ({
  '@type': 'BreadcrumbList',
  itemListElement: items.map(([name, path], i) => ({ '@type': 'ListItem', position: i + 1, name, item: SITE + path }))
});

const topBar = course => `<a class="skip" href="#isi">Langsung ke isi</a>
<header class="top"><div class="shell">
  <a class="brand" href="/"><img src="/assets/brand/kodeloka-mark.svg" alt="" width="34" height="34">Kodeloka</a>
  <nav class="top-links" aria-label="Navigasi">
    <a href="/#katalog">Semua kelas</a>${course ? `<a href="/${course.slug}/materi/">Materi ${esc(course.name)}</a><a class="cta" href="/${course.slug}/">Kelas interaktif</a>` : '<a class="cta" href="/#katalog">Pilih kelas</a>'}
  </nav>
</div></header>`;

const footer = `<footer class="foot"><div class="shell">
  <p><strong>Kodeloka</strong> adalah kelas pemrograman gratis berbahasa Indonesia: tanpa akun, tanpa iklan, progres tersimpan di perangkatmu.</p>
  <p>Bagian dari <a href="https://asadinedu.com/">Asadin Edu</a>, bersama <a href="https://biotaloka.asadinedu.com/">Biotaloka</a>, <a href="https://kimialoka.asadinedu.com/">Kimialoka</a>, <a href="https://fisikaloka.asadinedu.com/">Fisikaloka</a>, dan <a href="https://mitoloka.asadinedu.com/">Mitoloka</a>.</p>
  <p>Video pendamping di beberapa kelas berasal dari kanal YouTube pemiliknya masing-masing; Kodeloka tidak berafiliasi dengan kanal tersebut. <a href="/tentang/">Tentang, sumber, dan privasi</a>.</p>
</div></footer>`;

function page({ headHtml, body }) {
  return `<!doctype html>
<html lang="id">
<head>
${headHtml}
<link rel="stylesheet" href="/assets/article.css">
</head>
<body>
${body}
</body>
</html>
`;
}

function chapterHtml(ch, many) {
  const code = ch.code ? `<h3>Contoh program</h3>\n<pre><code>${esc(ch.code)}</code></pre>` : '';
  if (!many) return `${ch.html}\n${code}`;
  return `<section class="chapter" id="bab-${ch.n}">
<h2>${esc(ch.title)}</h2>
${ch.summary ? `<p class="chapter-summary">${esc(ch.summary)}</p>` : ''}
${ch.html}
${code}
<p><a href="../../#modul-${ch.n}">Praktik dan kuis bab ini di kelas interaktif →</a></p>
</section>`;
}

const urls = [];
const addUrl = (path, priority) => urls.push({ loc: SITE + path, priority });

await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });
await cp(join(root, 'assets'), join(dist, 'assets'), { recursive: true });
for (const c of courses) await cp(join(root, c.slug), join(dist, c.slug), { recursive: true });

// Home page
{
  let html = await readFile(join(root, 'index.html'), 'utf8');
  const title = 'Kodeloka · Belajar Pemrograman, Backend, dan DevOps dalam Bahasa Indonesia';
  const description = (/<meta name="description" content="([^"]*)">/.exec(html) || [])[1];
  const ld = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'WebSite', '@id': SITE + '/#website', name: 'Kodeloka', url: SITE + '/', inLanguage: 'id', description, publisher: ORG },
      { ...ORG, founder: { '@type': 'Person', name: 'Prasada Arif Nurudin' } },
      {
        '@type': 'ItemList',
        name: 'Kelas Kodeloka',
        itemListElement: courses.map((c, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          item: { '@type': 'Course', name: `Kelas ${c.name}`, description: c.description, url: `${SITE}/${c.slug}/`, inLanguage: 'id', isAccessibleForFree: true, provider: ORG }
        }))
      }
    ]
  };
  html = html.replace(/<meta charset="UTF-8">\s*<meta name="viewport"[^>]*>\s*<meta name="description"[^>]*>\s*<title>[^<]*<\/title>\s*<link rel="icon"[^>]*>/, head({ title, description, path: '/', ld }));
  if (!html.includes('rel="canonical"')) throw new Error('home head was not rewritten');
  html = html.replace('<div class="catalog-status" id="hasilStat" aria-live="polite"></div>', `<div class="catalog-status" id="hasilStat" aria-live="polite">${catalog.status}</div>`);
  html = html.replace('<div id="hasil"></div>', `<div id="hasil">${catalog.results}</div>`);
  if (!html.includes('class="course-card')) throw new Error('home catalog was not inlined');
  await writeFile(join(dist, 'index.html'), html);
  addUrl('/', '1.0');
}

const sideList = (course, units, current) => `<aside class="side" aria-label="Daftar materi ${esc(course.name)}">
<h2>${course.slug === 'golang' ? 'Domain' : 'Modul'} ${esc(course.name)}</h2>
<ol>${units.map(u => `<li><a href="/${course.slug}/materi/${u.slug}/"${u === current ? ' aria-current="page"' : ''}>${esc(course.slug === 'golang' ? `${u.eyebrow}: ${u.title}` : `${u.start}. ${u.title}`)}</a></li>`).join('')}</ol>
</aside>`;

for (const course of courses) {
  const units = unitsFor(course);
  const coursePath = `/${course.slug}/`;
  const courseLd = {
    '@type': 'Course',
    '@id': SITE + coursePath + '#course',
    name: `Kelas ${course.name}`,
    description: course.description,
    url: SITE + coursePath,
    inLanguage: 'id',
    isAccessibleForFree: true,
    provider: ORG,
    offers: { '@type': 'Offer', category: 'Free', price: 0, priceCurrency: 'IDR' },
    hasCourseInstance: { '@type': 'CourseInstance', courseMode: 'Online', inLanguage: 'id' },
    hasPart: units.map(u => ({ '@type': 'LearningResource', name: u.title, url: `${SITE}/${course.slug}/materi/${u.slug}/` }))
  };

  // Interactive course page: metadata plus a visible link to the article version.
  {
    const file = join(dist, course.slug, 'index.html');
    let html = await readFile(file, 'utf8');
    html = html.replace(/<meta name="description"[^>]*>\s*/i, '');
    html = html.replace(/<link rel="icon"[^>]*>\s*/gi, '');
    html = html.replace(/<title>[^<]*<\/title>/, head({
      title: `${course.title} | Kodeloka`,
      description: course.description,
      path: coursePath,
      ld: { '@context': 'https://schema.org', '@graph': [courseLd, crumbList([['Kodeloka', '/'], [`Kelas ${course.name}`, coursePath]])] }
    }).replace(/<meta charset="utf-8">\s*<meta name="viewport"[^>]*>\s*/, ''));
    const link = `<a class="lesson-articles-link" href="materi/" aria-label="Baca materi ${esc(course.name)} sebagai artikel" title="Baca materi sebagai artikel"><span aria-hidden="true">📖</span><span class="lesson-articles-text" aria-hidden="true">Baca materi</span></a>`;
    if ((html.match(/<\/header>/g) || []).length < 1) throw new Error(`${course.slug}: no header`);
    html = html.replace('</header>', `${link}</header>`);
    await writeFile(file, html);
    addUrl(coursePath, '0.9');
  }

  // Article index for the course.
  {
    const groups = [];
    for (const u of units) {
      const key = course.slug === 'golang' ? '' : u.category;
      if (!groups.length || groups.at(-1).key !== key) groups.push({ key, units: [] });
      groups.at(-1).units.push(u);
    }
    const path = `/${course.slug}/materi/`;
    const count = extracted.get(course.slug).length;
    const title = `Materi ${course.name}: ${count} ${course.slug === 'golang' ? 'bab' : 'modul'} berbahasa Indonesia | Kodeloka`;
    const description = clip(`Daftar lengkap materi kelas ${course.name} di Kodeloka. ${course.description}`);
    const body = `${topBar(course)}
<main id="isi" class="shell">
<ol class="crumbs"><li><a href="/">Kodeloka</a></li><li><a href="/${course.slug}/">Kelas ${esc(course.name)}</a></li><li>Materi</li></ol>
<div class="lede">
  <p class="eyebrow">Materi tertulis · ${count} ${course.slug === 'golang' ? 'bab dalam ' + units.length + ' domain' : 'modul'}</p>
  <h1>Materi ${esc(course.name)}</h1>
  <p class="summary">${esc(course.description)}</p>
  <div class="cta-row"><a class="button primary" href="/${course.slug}/">Buka kelas interaktif →</a><a class="button ghost" href="/${course.slug}/materi/${units[0].slug}/">Mulai dari awal</a></div>
</div>
${groups.map(g => `<section class="index-group">${g.key ? `<h2>${esc(g.key)}</h2>` : ''}<ol class="index-list">${g.units.map(u => `<li><a href="/${course.slug}/materi/${u.slug}/"><b>${esc(course.slug === 'golang' ? `${u.eyebrow}: ${u.title}` : `${u.start}. ${u.title}`)}</b><span>${esc(clip(u.summary || '', 170))}</span></a></li>`).join('')}</ol></section>`).join('\n')}
</main>
${footer}`;
    await mkdir(join(dist, course.slug, 'materi'), { recursive: true });
    await writeFile(join(dist, course.slug, 'materi', 'index.html'), page({
      headHtml: head({ title, description, path, ld: { '@context': 'https://schema.org', '@graph': [crumbList([['Kodeloka', '/'], [`Kelas ${course.name}`, coursePath], ['Materi', path]])] } }),
      body
    }));
    addUrl(path, '0.8');
  }

  // One page per unit.
  for (const [i, unit] of units.entries()) {
    const path = `/${course.slug}/materi/${unit.slug}/`;
    const many = unit.chapters.length > 1;
    const bodyText = plain(unit.chapters.map(ch => ch.html).join(' '));
    const description = clip(unit.summary && unit.summary.length > 40 ? unit.summary : bodyText);
    const title = course.slug === 'golang'
      ? `${unit.title}: Belajar Golang ${unit.eyebrow} | Kodeloka`
      : `${unit.title} — Belajar ${course.name} | Kodeloka`;
    const prev = units[i - 1], next = units[i + 1];
    const ld = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': ['Article', 'LearningResource'],
          headline: clip(unit.title, 110),
          name: unit.title,
          description,
          url: SITE + path,
          inLanguage: 'id',
          image: OG_IMAGE,
          dateModified: TODAY,
          isAccessibleForFree: true,
          learningResourceType: 'Materi pelajaran',
          isPartOf: { '@id': SITE + coursePath + '#course', '@type': 'Course', name: `Kelas ${course.name}`, url: SITE + coursePath },
          author: ORG,
          publisher: ORG
        },
        crumbList([['Kodeloka', '/'], [`Kelas ${course.name}`, coursePath], ['Materi', `/${course.slug}/materi/`], [unit.title, path]])
      ]
    };
    const body = `${topBar(course)}
<div class="shell">
<ol class="crumbs"><li><a href="/">Kodeloka</a></li><li><a href="/${course.slug}/">Kelas ${esc(course.name)}</a></li><li><a href="/${course.slug}/materi/">Materi</a></li></ol>
<div class="layout">
<main id="isi">
  <div class="lede">
    <p class="eyebrow">${esc(unit.eyebrow)}${many ? ` · ${unit.chapters.length} bab` : ` · Modul ${unit.start} dari ${units.length}`}</p>
    <h1>${esc(unit.title)}</h1>
    ${unit.summary && !many ? `<p class="summary">${esc(unit.summary)}</p>` : ''}
    <div class="cta-row"><a class="button primary" href="/${course.slug}/#modul-${unit.start}">Praktik dan kuis di kelas interaktif →</a></div>
  </div>
  <article class="prose">
${unit.chapters.map(ch => chapterHtml(ch, many)).join('\n')}
  </article>
  <nav class="pager" aria-label="Materi sebelum dan sesudah">
    ${prev ? `<a class="prev" href="/${course.slug}/materi/${prev.slug}/"><small>← Sebelumnya</small>${esc(prev.title)}</a>` : ''}
    ${next ? `<a class="next" href="/${course.slug}/materi/${next.slug}/"><small>Berikutnya →</small>${esc(next.title)}</a>` : ''}
  </nav>
</main>
${sideList(course, units, unit)}
</div>
</div>
${footer}`;
    await mkdir(join(dist, course.slug, 'materi', unit.slug), { recursive: true });
    await writeFile(join(dist, course.slug, 'materi', unit.slug, 'index.html'), page({
      headHtml: head({ title, description, path, type: 'article', ld }),
      body
    }));
    addUrl(path, '0.6');
  }
}

// About page: who runs the site, where the videos come from, what is stored, how to report mistakes.
{
  const path = '/tentang/';
  const videoChannels = 'freeCodeCamp.org (Docker), Corey Schafer (FastAPI), JavaScript Mastery (Next.js), Programming with Mosh dan TechWorld with Nana (Git &amp; CI/CD), Programmer Zaman Now (Microservices dan Redis), serta kanal resmi Kong (Kong API Gateway)';
  const body = `${topBar(null)}
<div class="shell"><div class="layout"><main id="isi">
<ol class="crumbs"><li><a href="/">Kodeloka</a></li><li>Tentang</li></ol>
<div class="lede"><p class="eyebrow">Tentang Kodeloka</p><h1>Kelas pemrograman yang bisa langsung dipraktikkan.</h1>
<p class="summary">Kodeloka adalah ruang belajar gratis berbahasa Indonesia untuk backend, data, infrastruktur, keamanan, dan observabilitas.</p></div>
<article class="prose">
<h2>Siapa pengelolanya</h2>
<p>Kodeloka bagian dari <a href="https://asadinedu.com/">Asadin Edu</a>, payung independen untuk pendidikan di Indonesia yang dijalankan oleh Prasada Arif Nurudin. Saudaranya: <a href="https://biotaloka.asadinedu.com/">Biotaloka</a> (biologi), <a href="https://kimialoka.asadinedu.com/">Kimialoka</a> (kimia), <a href="https://fisikaloka.asadinedu.com/">Fisikaloka</a> (fisika), dan <a href="https://mitoloka.asadinedu.com/">Mitoloka</a> (mitologi).</p>
<h2>Cara materi disusun</h2>
<p>Materi ditulis dalam bahasa Indonesia dengan bantuan alat AI, lalu diperiksa terhadap dokumentasi resmi tiap teknologi. Setiap kelas berisi materi tertulis, contoh perintah atau kode, latihan, dan kuis. Teknologi berubah cepat, jadi bila menemukan perintah yang usang atau penjelasan yang keliru, laporkan agar bisa diperbaiki.</p>
<h2>Video pendamping</h2>
<p>Beberapa kelas menampilkan video YouTube dari kanal pemiliknya: ${videoChannels}. Video hanya dipasang di modul yang benar-benar dibahas video itu, dan diputar lewat mode privasi YouTube (youtube-nocookie.com). Kodeloka tidak berafiliasi dengan kanal-kanal tersebut; seluruh hak atas video ada pada pembuatnya.</p>
<h2>Privasi</h2>
<ul>
<li>Tidak ada akun, iklan, atau analitik pelacak.</li>
<li>Progres, penanda, dan catatan disimpan di peramban kamu sendiri (localStorage) dan tidak dikirim ke server.</li>
<li>Saat kamu menekan tombol jalankan di editor Golang, kodenya dikirim ke Go Playground resmi (play.golang.org) untuk dikompilasi.</li>
<li>Video dimuat dari YouTube hanya saat tab Video dibuka.</li>
</ul>
<h2>Melaporkan kesalahan</h2>
<p>Laporan kesalahan dan saran bisa dikirim lewat <a href="https://github.com/asaddin02/asadin-edu-kodeloka/issues">GitHub Issues</a>. Sertakan nama kelas dan modulnya.</p>
</article></main></div></div>
${footer}`;
  await mkdir(join(dist, 'tentang'), { recursive: true });
  await writeFile(join(dist, 'tentang', 'index.html'), page({
    headHtml: head({ title: 'Tentang Kodeloka: pengelola, sumber video, dan privasi', description: 'Siapa yang mengelola Kodeloka, bagaimana materinya disusun, dari mana video pendampingnya, apa yang disimpan di perangkatmu, dan cara melaporkan kesalahan.', path, ld: { '@context': 'https://schema.org', '@graph': [{ '@type': 'AboutPage', name: 'Tentang Kodeloka', url: SITE + path, inLanguage: 'id', publisher: ORG }, crumbList([['Kodeloka', '/'], ['Tentang', path]])] } }),
    body
  }));
  addUrl(path, '0.4');
}

// 404
await writeFile(join(dist, '404.html'), page({
  headHtml: head({ title: 'Halaman tidak ditemukan · Kodeloka', description: 'Halaman ini tidak ada di Kodeloka. Semua kelas pemrograman dan materinya bisa dibuka dari katalog di beranda.', path: '/404' }).replace(/<link rel="canonical"[^>]*>\n/, '') + '\n<meta name="robots" content="noindex">',
  body: `${topBar(null)}
<main id="isi" class="shell"><div class="lede">
  <p class="eyebrow">404</p>
  <h1>Halaman ini tidak ada.</h1>
  <p class="summary">Mungkin alamatnya berubah. Semua kelas dan materinya bisa dibuka dari katalog.</p>
  <div class="cta-row"><a class="button primary" href="/#katalog">Lihat semua kelas →</a></div>
</div></main>
${footer}`
}));

await writeFile(join(dist, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url><loc>${u.loc}</loc><lastmod>${TODAY}</lastmod><priority>${u.priority}</priority></url>`).join('\n')}
</urlset>
`);
await writeFile(join(dist, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`);
await writeFile(join(dist, 'manifest.webmanifest'), JSON.stringify({
  name: 'Kodeloka', short_name: 'Kodeloka', lang: 'id', start_url: '/', display: 'standalone',
  background_color: '#f7f3eb', theme_color: '#f7f3eb', description: 'Kelas pemrograman, backend, dan DevOps berbahasa Indonesia.',
  icons: [
    { src: '/assets/brand/icon-192.png', sizes: '192x192', type: 'image/png' },
    { src: '/assets/brand/icon-512.png', sizes: '512x512', type: 'image/png' },
    { src: '/assets/brand/kodeloka-mark.svg', sizes: 'any', type: 'image/svg+xml' }
  ]
}, null, 2) + '\n');
// The course engines use inline handlers and inline styles, so scripts keep 'unsafe-inline'; everything
// else is locked to this origin plus YouTube's privacy-mode player and the Go Playground
// (the Golang editor sends code there only when the learner presses Run).
await writeFile(join(dist, '_headers'), `/*
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  X-Frame-Options: DENY
  Permissions-Policy: geolocation=(), camera=(), microphone=(), payment=(), usb=()
  Strict-Transport-Security: max-age=31536000
  Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; font-src 'self'; img-src 'self' data: https://i.ytimg.com; frame-src https://www.youtube-nocookie.com; connect-src 'self' https://play.golang.org; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'

/assets/brand/*
  Cache-Control: public, max-age=86400
`);
// Scripts and styles keep Pages' default (revalidate every time): their names carry no content hash, so a
// long max-age would keep serving the previous version from the edge after a deploy.

console.log(`dist: ${urls.length} URL di sitemap (${courses.length} kelas, ${urls.length - 2 - courses.length * 2} halaman materi)`);
