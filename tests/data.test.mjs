import { test } from 'node:test';
import assert from 'node:assert/strict';
import { COURSES, loadAllCards } from '../site/js/data.js';
import { COURSE_CODES } from '../scripts/lib/cards.mjs';

const okJson = (body) => ({ ok: true, status: 200, json: async () => body });
const card = (course, n) => ({ id: `${course}-${n}`, course, type: 'fact', topic: 'T', importance: 1, title: 't', body: 'b' });

test('ders listesi derleme betiğiyle aynı', () => {
  assert.deepEqual(COURSES.map((c) => c.code), COURSE_CODES);
});

test('bir dersin dosyası yoksa ya da bozuksa diğerleri yüklenir', async () => {
  const fetchImpl = async (url) => {
    if (url.includes('PER247')) return { ok: false, status: 404, json: async () => ({}) };
    if (url.includes('PER243')) return { ok: true, status: 200, json: async () => { throw new SyntaxError('bozuk'); } };
    const code = url.match(/PER\d{3}/)[0];
    return okJson([card(code, 1), card(code, 2), { bozuk: true }]);
  };
  const { cards, failed } = await loadAllCards(fetchImpl);
  assert.deepEqual([...failed].sort(), ['PER243', 'PER247']);
  assert.equal(cards.length, 8);
});

test('başka derse ait kart o dersin dosyasından alınmaz; boş ders başarısız sayılır', async () => {
  const fetchImpl = async (url) => okJson([card('PER141', url.match(/PER\d{3}/)[0])]);
  const { cards, failed } = await loadAllCards(fetchImpl);
  assert.equal(cards.length, 1);
  assert.equal(failed.length, 5);
});

test('hiçbir dosya yüklenemezse hata fırlatır', async () => {
  await assert.rejects(loadAllCards(async () => { throw new TypeError('ağ yok'); }), /Hiç kart yüklenemedi/);
});

test('bozuk tür alanları ve yinelenen kimlikler akışa girmez', async () => {
  const fetchImpl = async (url) => {
    const code = url.match(/PER\d{3}/)[0];
    return okJson([
      card(code, 1), card(code, 1),
      { ...card(code, 2), type: 'mcq', options: null },
      { ...card(code, 3), type: 'compare', left: null },
      { ...card(code, 4), body: '' },
      { ...card(code, 5), importance: 8 },
      { ...card(code, 6), type: 'unknown' },
    ]);
  };
  const { cards } = await loadAllCards(fetchImpl);
  assert.equal(cards.length, 6);
});

test('cevap vermeyen ders diğerlerinin yüklenmesini engellemez', async () => {
  let signal;
  const fetchImpl = async (url, options) => {
    const code = url.match(/PER\d{3}/)[0];
    if (code === 'PER247') {
      signal = options.signal;
      return new Promise(() => {});
    }
    return okJson([card(code, 1)]);
  };
  const result = await Promise.race([
    loadAllCards(fetchImpl, 'data/', { timeoutMs: 15 }),
    new Promise((resolve) => setTimeout(() => resolve('takıldı'), 150)),
  ]);
  assert.notEqual(result, 'takıldı');
  assert.equal(result.cards.length, 5);
  assert.deepEqual(result.failed, ['PER247']);
  assert.equal(signal.aborted, true);
});

test('yanıt gövdesinin takılması da zaman aşımına uğrar', async () => {
  const fetchImpl = async (url) => url.includes('PER247')
    ? { ok: true, json: () => new Promise(() => {}) }
    : okJson([card(url.match(/PER\d{3}/)[0], 1)]);
  const result = await Promise.race([
    loadAllCards(fetchImpl, 'data/', { timeoutMs: 15 }),
    new Promise((resolve) => setTimeout(() => resolve('takıldı'), 150)),
  ]);
  assert.notEqual(result, 'takıldı');
  assert.deepEqual(result.failed, ['PER247']);
});
