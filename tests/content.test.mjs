import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { buildCourse, computeStats, distributionWarnings } from '../scripts/build-data.mjs';
import { COURSE_CODES } from '../scripts/lib/cards.mjs';

test('yayımlanan bütün kartların kaynak dosyasında kalıcı kimliği var', async () => {
  for (const code of COURSE_CODES) {
    const dir = new URL(`../content/${code}/`, import.meta.url);
    for (const file of (await readdir(dir)).filter((f) => f.endsWith('.json') && !f.startsWith('_'))) {
      const doc = JSON.parse(await readFile(new URL(file, dir), 'utf8'));
      for (const [i, card] of doc.cards.entries()) {
        assert.match(card.id ?? '', new RegExp(`^${code}-[0-9a-z]{7}$`), `${code}/${file} #${i + 1}`);
      }
    }
  }
});

test('altı dersin yayımlanan verisi güncel, kaynaklı ve kapsam hedefleri içinde', async () => {
  let total = 0;
  for (const code of COURSE_CODES) {
    const result = await buildCourse(fileURLToPath(new URL('../content/', import.meta.url)), code);
    assert.deepEqual(result.errors, [], code);
    assert.equal(result.missing, false, code);
    const stats = computeStats(result.cards);
    assert.deepEqual(distributionWarnings(stats), [], code);
    assert.ok(stats.topics.every((t) => t.count >= 15), `${code}: konu başına en az 15 kart`);
    assert.ok(result.cards.every((c) => typeof c.source === 'string' && c.source.trim()), `${code}: kaynak izi`);
    const published = JSON.parse(await readFile(new URL(`../site/data/${code}.json`, import.meta.url), 'utf8'));
    assert.deepEqual(published, result.cards, `${code}: derleme çıktısı güncel`);
    total += stats.total;
  }
  assert.ok(total > 3000);
});
