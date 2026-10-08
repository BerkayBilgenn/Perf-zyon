// site/index.html'den claude.ai Artifact sürümünü üretir. Artifact yayınlanırken sayfa kendi iskeletine sarıldığı için
// doctype, html/head/body etiketleri ve charset/viewport meta etiketleri çıkarılır; geri kalan her şey korunur.
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export function toArtifactHtml(html) {
  return `${html
    .replace(/<!doctype html>\s*/i, '')
    .replace(/<\/?(html|head|body)(\s[^>]*)?>\s*/gi, '')
    .replace(/<meta\s+(charset|name="viewport")[^>]*>\s*/gi, '')
    .trim()}\n`;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const src = await readFile('site/index.html', 'utf8');
  await mkdir('dist', { recursive: true });
  await writeFile('dist/artifact.html', toArtifactHtml(src));
  console.log('dist/artifact.html yazıldı');
}
