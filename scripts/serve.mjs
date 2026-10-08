// Önizleme için bağımlılıksız statik sunucu. Kullanım: node scripts/serve.mjs site   (PORT=5173)
import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve(process.argv[2] ?? 'site');
const port = Number(process.env.PORT ?? 5173);
const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
};

http
  .createServer(async (req, res) => {
    try {
      let rel = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
      if (rel.endsWith('/')) rel += 'index.html';
      const file = path.resolve(root, `.${rel}`);
      if (file !== root && !file.startsWith(root + path.sep)) {
        res.writeHead(403).end('Yasak');
        return;
      }
      if (!(await stat(file)).isFile()) throw new Error('dosya değil');
      res.writeHead(200, { 'content-type': TYPES[path.extname(file)] ?? 'application/octet-stream', 'cache-control': 'no-store' });
      res.end(await readFile(file));
    } catch {
      res.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' }).end('Bulunamadı');
    }
  })
  .listen(port, '127.0.0.1', () => console.log(`Önizleme: http://localhost:${port}`));
