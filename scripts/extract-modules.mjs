// Reads every module of every course the way a learner sees it (title, summary and the "Materi" tab)
// and writes data/modules.json. The build turns that file into one crawlable article page per module.
// The courses keep their data inside five different engines, so the browser is the one reader that
// works for all of them. Run it after changing course content: npm run extract
import { createServer } from 'node:http';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { chromium } from 'playwright';

const root = new URL('..', import.meta.url).pathname;
const courses = JSON.parse(await readFile(join(root, 'scripts/courses.json'), 'utf8'));
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.json': 'application/json' };

const server = createServer(async (req, res) => {
  let path = normalize(decodeURIComponent(new URL(req.url, 'http://x').pathname));
  if (path.endsWith('/')) path += 'index.html';
  try {
    const body = await readFile(join(root, path));
    res.writeHead(200, { 'content-type': types[extname(path)] || 'application/octet-stream' });
    res.end(body);
  } catch {
    res.writeHead(404).end();
  }
});
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const base = `http://127.0.0.1:${server.address().port}/`;

const ITEMS = '.chapter-item, .chapter-card, .item-modul';
const browser = await chromium.launch();
const out = [];
for (const course of courses) {
  const page = await browser.newPage({ viewport: { width: 1366, height: 900 } });
  await page.route(/youtube|doubleclick|googleapis|gstatic|ytimg/, route => route.abort());
  await page.goto(base + course.slug + '/');
  await page.waitForSelector(ITEMS);
  const count = await page.locator(ITEMS).count();
  const modules = [];
  for (let i = 0; i < count; i++) {
    await page.locator(ITEMS).nth(i).click();
    await page.waitForTimeout(40);
    const theoryTab = page.locator('.tab-btn[data-tab="theory"]');
    if (await theoryTab.count()) await theoryTab.first().click();
    modules.push(await page.evaluate(() => {
      const text = el => (el ? el.textContent.replace(/\s+/g, ' ').trim() : '');
      const head = document.querySelector('header.kepala-modul');
      const title = text(document.getElementById('chapterTitle') || head?.querySelector('h1, h2'));
      const summary = text(document.getElementById('chapterDesc') || head?.querySelector('p'));
      const category = text(document.getElementById('chapterCategoryBadge') || head?.querySelector('.kategori, .label, span'));
      const body = (document.getElementById('articleBody') || document.getElementById('theoryBody') || document.querySelector('article.artikel')).cloneNode(true);
      body.querySelectorAll('button, script, style, iframe, input, textarea, select').forEach(el => el.remove());
      body.querySelectorAll('*').forEach(el => {
        for (const attr of [...el.attributes]) {
          if (/^on/i.test(attr.name) || attr.name === 'style' || attr.name === 'id' || attr.name.startsWith('data-') || attr.name.startsWith('aria-') || attr.name === 'role' || attr.name === 'tabindex') el.removeAttribute(attr.name);
        }
      });
      return { title, summary, category, html: body.innerHTML.trim(), words: body.textContent.trim().split(/\s+/).length };
    }));
  }
  // Golang keeps a starter program per chapter; its theory alone is short, so the article shows both.
  const codes = await page.evaluate(() => (typeof chapters !== 'undefined' && chapters.every(c => 'initialCode' in c) ? chapters.map(c => c.initialCode) : null));
  if (codes) modules.forEach((m, i) => { m.code = codes[i]; });
  out.push({ slug: course.slug, modules });
  console.log(course.slug.padEnd(14), count, 'modul');
  await page.close();
}
// The home catalog is drawn by script too. Keeping its rendered markup lets the build ship it in the
// HTML, so the course links exist before any script runs; the page script then redraws the same cards.
const home = await browser.newPage({ viewport: { width: 1366, height: 900 } });
await home.goto(base);
await home.waitForSelector('#hasil .course-card');
const catalog = await home.evaluate(() => ({
  results: document.getElementById('hasil').innerHTML.trim(),
  status: document.getElementById('hasilStat').innerHTML.trim()
}));
await home.close();
await browser.close();
server.close();
await mkdir(join(root, 'data'), { recursive: true });
await writeFile(join(root, 'data/modules.json'), JSON.stringify(out, null, 1) + '\n');
await writeFile(join(root, 'data/catalog.json'), JSON.stringify(catalog, null, 1) + '\n');
