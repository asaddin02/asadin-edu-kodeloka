// Checks dist/ without a browser: every internal link resolves, every page has its own title,
// description and canonical, JSON-LD parses, and the sitemap lists exactly the indexable pages.
import { readFile, readdir } from 'node:fs/promises';
import { join, relative, dirname, resolve } from 'node:path';
import assert from 'node:assert/strict';

const dist = new URL('../dist/', import.meta.url).pathname;
const SITE = (process.env.SITE_URL || 'https://kodeloka.asadinedu.com').replace(/\/+$/, '');

async function walk(dir) {
  const out = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) out.push(...(await walk(p)));
    else out.push(p);
  }
  return out;
}

const files = await walk(dist);
const fileSet = new Set(files.map(f => '/' + relative(dist, f)));
const exists = path => fileSet.has(path) || fileSet.has(path.replace(/\/?$/, '/') + 'index.html');
const html = files.filter(f => f.endsWith('.html'));
const titles = new Map();
const problems = [];

for (const file of html) {
  const rel = '/' + relative(dist, file);
  const src = await readFile(file, 'utf8');
  const title = /<title>([^<]+)<\/title>/.exec(src)?.[1];
  if (!title) problems.push(`${rel}: no <title>`);
  if (!/<meta name="description" content="[^"]{50,}">/.test(src)) problems.push(`${rel}: missing or short description`);
  if (rel !== '/404.html') {
    const canonical = /<link rel="canonical" href="([^"]+)">/.exec(src)?.[1];
    const expected = SITE + rel.replace(/index\.html$/, '');
    if (canonical !== expected) problems.push(`${rel}: canonical ${canonical} != ${expected}`);
    if (titles.has(title)) problems.push(`${rel}: duplicate title with ${titles.get(title)}`);
    titles.set(title, rel);
  }
  for (const m of src.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try { JSON.parse(m[1]); } catch (e) { problems.push(`${rel}: bad JSON-LD ${e.message}`); }
  }
  const scriptless = src.replace(/<script[\s\S]*?<\/script>/g, '');
  for (const m of scriptless.matchAll(/(?:href|src)="([^"#]+)(?:#[^"]*)?"/g)) {
    const url = m[1];
    if (/^(https?:|mailto:|data:)/.test(url)) continue;
    const target = url.startsWith('/') ? url : '/' + relative(dist, resolve(dirname(file), url)) + (url.endsWith('/') ? '/' : '');
    if (!exists(decodeURI(target).replace(/\/+$/, '/'))) problems.push(`${rel}: broken link ${url}`);
  }
}

const sitemap = await readFile(join(dist, 'sitemap.xml'), 'utf8');
const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
for (const loc of locs) if (!exists(loc.replace(SITE, ''))) problems.push(`sitemap: ${loc} has no page`);
const indexable = html.filter(f => !f.endsWith('404.html')).length;
assert.equal(locs.length, indexable, 'sitemap lists every indexable page');
assert.match(await readFile(join(dist, 'robots.txt'), 'utf8'), new RegExp(`Sitemap: ${SITE}/sitemap.xml`));

const home = await readFile(join(dist, 'index.html'), 'utf8');
assert.equal((home.match(/class="course-card[^"]*" href="[a-z0-9-]+\/" data-folder=/g) || []).length, 19, 'home ships all 19 course cards as HTML');

if (problems.length) {
  console.error(problems.slice(0, 40).join('\n'));
  console.error(`${problems.length} problem(s)`);
  process.exit(1);
}
console.log(`site ok: ${html.length} pages, ${locs.length} sitemap URLs, links and metadata valid`);
