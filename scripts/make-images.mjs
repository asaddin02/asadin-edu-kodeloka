// Renders the PNG icons and the 1200x630 Open Graph card from the SVG mark. Run once after the mark or
// the course numbers change: node scripts/make-images.mjs (needs network for the display font).
import { readFile } from 'node:fs/promises';
import { chromium } from 'playwright';

const root = new URL('..', import.meta.url).pathname;
const mark = await readFile(root + 'assets/brand/kodeloka-mark.svg', 'utf8');
const courses = JSON.parse(await readFile(root + 'scripts/courses.json', 'utf8'));
const modules = JSON.parse(await readFile(root + 'data/modules.json', 'utf8')).reduce((n, c) => n + c.modules.length, 0);
const browser = await chromium.launch();

for (const [file, size, pad] of [['icon-192.png', 192, 18], ['icon-512.png', 512, 48], ['apple-touch-icon.png', 180, 22]]) {
  const page = await browser.newPage({ viewport: { width: size, height: size } });
  await page.setContent(`<body style="margin:0;background:#f7f3eb;display:grid;place-items:center;width:${size}px;height:${size}px">
    <div style="width:${size - pad * 2}px;height:${size - pad * 2}px">${mark.replace('<svg ', '<svg style="width:100%;height:100%" ')}</div></body>`);
  await page.screenshot({ path: root + 'assets/brand/' + file });
  await page.close();
}

const names = courses.map(c => c.name);
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await page.setContent(`<!doctype html><html><head>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600&family=Instrument+Sans:wght@500;700&display=block" rel="stylesheet">
<style>
  body { margin:0; width:1200px; height:630px; background:#f7f3eb; color:#173e40; font-family:'Instrument Sans', sans-serif; position:relative; overflow:hidden; }
  .glow1 { position:absolute; right:-120px; top:-140px; width:520px; height:520px; border-radius:50%; background:radial-gradient(circle, rgba(185,221,122,.55), transparent 65%); }
  .glow2 { position:absolute; left:-160px; bottom:-200px; width:560px; height:560px; border-radius:50%; background:radial-gradient(circle, rgba(158,217,232,.45), transparent 65%); }
  .wrap { position:absolute; inset:64px 72px; display:flex; flex-direction:column; }
  .brand { display:flex; align-items:center; gap:18px; font-weight:700; font-size:34px; letter-spacing:-.02em; }
  .brand svg { width:64px; height:64px; }
  .brand small { display:block; font-size:15px; letter-spacing:.14em; text-transform:uppercase; color:#667a78; margin-top:2px; }
  h1 { font-family:'Fraunces', serif; font-weight:600; font-size:68px; line-height:1.02; letter-spacing:-.03em; margin:44px 0 0; max-width:880px; }
  h1 em { font-style:normal; color:#db5538; }
  .meta { margin-top:auto; display:flex; align-items:flex-end; justify-content:space-between; gap:24px; }
  .chips { display:flex; flex-wrap:wrap; gap:8px; max-width:760px; }
  .chips span { border:1.5px solid #bfccc0; border-radius:999px; padding:7px 14px; font-size:18px; font-weight:700; background:#fffdf8; }
  .count { text-align:right; font-size:18px; color:#315c5e; font-weight:700; line-height:1.4; }
  .count b { display:block; font-family:'Fraunces', serif; font-size:56px; color:#173e40; }
</style></head><body><div class="glow1"></div><div class="glow2"></div>
<div class="wrap">
  <div class="brand">${mark}<div>Kodeloka<small>Asadin Edu</small></div></div>
  <h1>Belajar pemrograman, backend, dan DevOps <em>dalam bahasa Indonesia.</em></h1>
  <div class="meta">
    <div class="chips">${names.slice(0, 12).map(n => `<span>${n}</span>`).join('')}</div>
    <div class="count"><b>${courses.length}</b>kelas · ${modules} modul<br>gratis, tanpa akun</div>
  </div>
</div></body></html>`);
await page.waitForLoadState('networkidle');
await page.evaluate(() => document.fonts.ready);
await page.screenshot({ path: root + 'assets/brand/og-image.png' });
await browser.close();
console.log('images written');
