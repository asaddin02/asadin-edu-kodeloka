// Static server for local work: node scripts/serve.mjs [dir] (default: the source tree; `dist` after a build).
// Serves folder/index.html for clean URLs and 404.html for missing paths, like Cloudflare Pages.
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize, resolve } from 'node:path';

const root = resolve(new URL('..', import.meta.url).pathname, process.argv[2] || '.');
const port = Number(process.env.PORT || 8790);
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png', '.json': 'application/json', '.xml': 'application/xml', '.txt': 'text/plain', '.webmanifest': 'application/manifest+json' };

createServer(async (req, res) => {
  let path = normalize(decodeURIComponent(new URL(req.url, 'http://x').pathname));
  let file = join(root, path);
  if (!file.startsWith(root)) return res.writeHead(403).end();
  try {
    if ((await stat(file)).isDirectory()) {
      if (!path.endsWith('/')) return res.writeHead(308, { location: path + '/' }).end();
      file = join(file, 'index.html');
    }
    const body = await readFile(file);
    res.writeHead(200, { 'content-type': types[extname(file)] || 'application/octet-stream' }).end(body);
  } catch {
    const notFound = await readFile(join(root, '404.html')).catch(() => 'Not found');
    res.writeHead(404, { 'content-type': 'text/html; charset=utf-8' }).end(notFound);
  }
}).listen(port, '127.0.0.1', () => console.log(`http://127.0.0.1:${port}/ (${root})`));
