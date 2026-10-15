// Browser checks against dist/: every course loads without script errors, every module opens with
// content, #modul-N deep links open the right module, the video tab never shows an unrelated or broken
// video, the home catalog filters, and no page scrolls sideways on a phone. Network to third parties
// (YouTube, fonts, Go Playground) is blocked so the run is offline and repeatable.
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { chromium } from 'playwright';

const dist = new URL('../dist/', import.meta.url).pathname;
const courses = JSON.parse(await readFile(new URL('../scripts/courses.json', import.meta.url), 'utf8'));
const modules = new Map(JSON.parse(await readFile(new URL('../data/modules.json', import.meta.url), 'utf8')).map(c => [c.slug, c.modules]));
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png' };

const server = createServer(async (req, res) => {
  let path = normalize(decodeURIComponent(new URL(req.url, 'http://x').pathname));
  let file = join(dist, path);
  try {
    if ((await stat(file)).isDirectory()) file = join(file, 'index.html');
    res.writeHead(200, { 'content-type': types[extname(file)] || 'application/octet-stream' }).end(await readFile(file));
  } catch {
    res.writeHead(404).end();
  }
});
await new Promise(r => server.listen(0, '127.0.0.1', r));
const base = `http://127.0.0.1:${server.address().port}`;
const ITEMS = '.chapter-item, .chapter-card, .item-modul';
const failures = [];
const fail = msg => { failures.push(msg); console.error('✗ ' + msg); };

const browser = await chromium.launch();
async function open(path, viewport = { width: 1366, height: 860 }) {
  const page = await browser.newPage({ viewport });
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  page.on('console', m => { if (m.type() === 'error' && !/Failed to load resource|ERR_FAILED|blocked/i.test(m.text())) errors.push(m.text()); });
  await page.route(url => !url.href.startsWith(base), route => route.abort());
  await page.goto(base + path);
  await page.waitForTimeout(250);
  return { page, errors };
}
const overflow = page => page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);

// Home
{
  const { page, errors } = await open('/');
  if (await page.locator('#hasil .course-card').count() !== 19) fail('home: expected 19 course cards');
  await page.fill('#cari', 'kafka');
  await page.waitForTimeout(100);
  const shown = await page.locator('#hasil .course-card').count();
  if (shown < 1 || shown > 3) fail(`home: search "kafka" shows ${shown} cards`);
  if (errors.length) fail('home: ' + errors.join(' | '));
  await page.close();
}

for (const course of courses) {
  const { page, errors } = await open(`/${course.slug}/`);
  const count = await page.locator(ITEMS).count();
  const expected = modules.get(course.slug).length;
  if (count !== expected) fail(`${course.slug}: ${count} modules in the list, expected ${expected}`);
  for (let i = 0; i < count; i++) {
    await page.locator(ITEMS).nth(i).click();
    const len = await page.evaluate(() => document.querySelector('main').innerText.trim().length);
    if (len < 200) fail(`${course.slug}: module ${i + 1} renders almost nothing`);
  }
  // Video tab: the iframe is either a checked youtube-nocookie embed or hidden with a notice.
  if (await page.locator('#youtubeIframe').count()) {
    for (let i = 0; i < count; i++) {
      await page.locator(ITEMS).nth(i).click();
      const v = await page.evaluate(() => ({ src: document.getElementById('youtubeIframe').getAttribute('src'), title: document.getElementById('videoTitleMeta')?.textContent }));
      if (v.src && !/^https:\/\/www\.youtube-nocookie\.com\/embed\/[\w-]{11}\?rel=0/.test(v.src)) fail(`${course.slug}: module ${i + 1} video src ${v.src}`);
      if (!v.src && !/Belum ada video/.test(v.title)) fail(`${course.slug}: module ${i + 1} has no video and no notice`);
    }
  }
  if (errors.length) fail(`${course.slug}: ${errors.slice(0, 3).join(' | ')}`);
  await page.close();

  // Deep link from the article pages.
  const n = Math.min(3, expected);
  const deep = await open(`/${course.slug}/#modul-${n}`);
  await deep.page.waitForTimeout(400);
  const want = modules.get(course.slug)[n - 1].title;
  const shownTitle = await deep.page.evaluate(() => (document.getElementById('chapterTitle') || document.querySelector('header.kepala-modul h1, header.kepala-modul h2'))?.textContent.replace(/\s+/g, ' ').trim());
  if (shownTitle !== want) fail(`${course.slug}: #modul-${n} opened "${shownTitle}", expected "${want}"`);
  await deep.page.close();

  // Phone width: course page and its article index must not scroll sideways.
  for (const path of [`/${course.slug}/`, `/${course.slug}/materi/`]) {
    const phone = await open(path, { width: 390, height: 844 });
    const o = await overflow(phone.page);
    if (o > 1) fail(`${path}: ${o}px horizontal overflow at 390px`);
    await phone.page.close();
  }
  console.log(`✓ ${course.slug} (${count} modul)`);
}

// A sample of article pages at phone width.
for (const path of ['/kafka/materi/05-consumer-group-rebalancing-dan-commit-offset/', '/golang/materi/domain-20-golang-web-development/', '/docker/materi/06-basic-docker-commands-dan-container-lifecycle/', '/tentang/']) {
  const { page, errors } = await open(path, { width: 390, height: 844 });
  if (!(await page.title())) fail(`${path}: no title (missing page?)`);
  const o = await overflow(page);
  if (o > 1) fail(`${path}: ${o}px horizontal overflow at 390px`);
  if (errors.length) fail(`${path}: ${errors.join(' | ')}`);
  await page.close();
}

await browser.close();
server.close();
if (failures.length) {
  console.error(`\n${failures.length} failure(s)`);
  process.exit(1);
}
console.log('\nbrowser ok');
