import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { buildCourse, computeStats, distributionWarnings, main } from '../scripts/build-data.mjs';

const fact = (title, extra = {}) => ({ type: 'fact', importance: 2, title, body: `${title} açıklaması.`, ...extra });

async function makeSrc(files) {
  const root = await mkdtemp(path.join(tmpdir(), 'dep-'));
  for (const [rel, content] of Object.entries(files)) {
    const p = path.join(root, rel);
    await mkdir(path.dirname(p), { recursive: true });
    await writeFile(p, typeof content === 'string' ? content : JSON.stringify(content));
  }
  return root;
}

test('geçerli kartlara kimlik, ders ve konu eklenir', async () => {
  const src = await makeSrc({ 'PER245/01-a.json': { topic: 'Kanülasyon', cards: [fact('Bir'), fact('İki', { topic: 'Özel konu' })] } });
  const { cards, errors, missing } = await buildCourse(src, 'PER245');
  assert.equal(missing, false);
  assert.deepEqual(errors, []);
  assert.equal(cards.length, 2);
  assert.match(cards[0].id, /^PER245-/);
  assert.equal(cards[0].course, 'PER245');
  assert.equal(cards[0].topic, 'Kanülasyon');
  assert.equal(cards[1].topic, 'Özel konu');
});

test('hatalı kart, bozuk dosya ve tekrar eden kart dosya ve sıra numarasıyla raporlanır', async () => {
  const src = await makeSrc({
    'PER245/01-a.json': { topic: 'A', cards: [fact('Bir'), { type: 'fact', importance: 2 }] },
    'PER245/02-b.json': '{ bozuk',
    'PER245/03-c.json': { topic: 'A', cards: [fact('Bir')] },
    'PER245/_notlar.json': '{ bu dosya atlanır',
  });
  const { cards, errors } = await buildCourse(src, 'PER245');
  assert.equal(cards.length, 1);
  assert.ok(errors.some((e) => e.startsWith('PER245/01-a.json #2:')));
  assert.ok(errors.some((e) => e.startsWith('PER245/02-b.json: JSON okunamadı')));
  assert.ok(errors.some((e) => e.includes('03-c.json #1: tekrarlanan kart')));
  assert.ok(!errors.some((e) => e.includes('_notlar')));
});

test('başka derse ait ve bozuk kimlikler derlemeyi geçemez', async () => {
  const src = await makeSrc({ 'PER245/01.json': { topic: 'A', cards: [fact('Bir', { id: 'x', course: 'PER141' })] } });
  const { cards, errors } = await buildCourse(src, 'PER245');
  assert.equal(cards.length, 0);
  assert.ok(errors.some((e) => e.includes('geçersiz kalıcı kimlik')));
});

test('klasör yoksa missing döner', async () => {
  const src = await makeSrc({});
  assert.equal((await buildCourse(src, 'PER141')).missing, true);
});

test('dağılım uyarıları hedeften sapmayı ve az kartı bildirir', () => {
  const stats = computeStats(Array.from({ length: 10 }, (_, i) => ({ type: 'fact', importance: 1, topic: `T${i % 3}` })));
  const warnings = distributionWarnings(stats);
  assert.ok(warnings.some((w) => w.startsWith('toplam 10 kart')));
  assert.ok(warnings.some((w) => w.startsWith('term: %0')));
  assert.equal(stats.topics.length, 3);
});

test('main çıktı dosyası yazar ve hata varsa 1 döner', async () => {
  const src = await makeSrc({ 'PER245/01.json': { topic: 'A', cards: [fact('Bir')] }, 'PER247/01.json': { topic: 'A', cards: [{ type: 'x' }] } });
  const out = path.join(src, 'out');
  const code = await main(['PER245', 'PER247', '--src', src, '--out', out]);
  assert.equal(code, 1);
  const written = JSON.parse(await readFile(path.join(out, 'PER245.json'), 'utf8'));
  assert.equal(written.length, 1);
});

test('varsayılan alt sınır ders başına 450 kart', () => {
  const make = (n) => computeStats(Array.from({ length: n }, (_, i) => ({ type: 'fact', importance: 1, topic: `T${i}` })));
  assert.ok(distributionWarnings(make(449)).some((w) => w.startsWith('toplam 449 kart (en az 450')));
  assert.ok(!distributionWarnings(make(450)).some((w) => w.startsWith('toplam')));
});

test('hatalı derlemede eski ders çıktısı kaldırılır', async () => {
  const src = await makeSrc({ 'PER245/01.json': { topic: 'A', cards: [{ type: 'x' }] }, 'out/PER245.json': '[{"eski":true}]' });
  const out = path.join(src, 'out');
  assert.equal(await main(['PER245', '--src', src, '--out', out]), 1);
  await assert.rejects(readFile(path.join(out, 'PER245.json')), { code: 'ENOENT' });
});

test('kaynak kimliği metin düzeltmesinden sonra korunur', async () => {
  const file = { topic: 'A', cards: [fact('Bir', { id: 'PER245-012abcd' })] };
  const src = await makeSrc({ 'PER245/01.json': file });
  assert.equal((await buildCourse(src, 'PER245')).cards[0].id, 'PER245-012abcd');
  file.cards[0].body = 'Düzeltilmiş açıklama.';
  await writeFile(path.join(src, 'PER245/01.json'), JSON.stringify(file));
  assert.equal((await buildCourse(src, 'PER245')).cards[0].id, 'PER245-012abcd');
});

test('farklı kimlikler aynı kartın iki kez yazılmasını gizleyemez', async () => {
  const src = await makeSrc({ 'PER245/01.json': { topic: 'A', cards: [fact('Bir', { id: 'PER245-012abcd' }), fact('Bir', { id: 'PER245-034abcd' })] } });
  assert.ok((await buildCourse(src, 'PER245')).errors.some((e) => e.includes('tekrarlanan kart')));
});
