import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Feed, RESHOW_LIMIT, mulberry32, spreadOut, weightedShuffle } from '../site/js/feed.js';

const KINDS = ['term', 'fact', 'mcq', 'flip', 'tf'];
function makeCards(n, { importance = () => 2, topics = 7 } = {}) {
  return Array.from({ length: n }, (_, i) => ({ id: `c${i}`, course: 'PER245', topic: `T${i % topics}`, type: KINDS[i % KINDS.length], importance: importance(i) }));
}
const take = (feed, n) => Array.from({ length: n }, () => feed.next());

test('bir turda her kart tam bir kez gelir, sonra yeni tur başlar', () => {
  const feed = new Feed(makeCards(40), { rng: mulberry32(1) });
  const first = take(feed, 40).map((x) => x.card.id);
  assert.equal(new Set(first).size, 40);
  const second = take(feed, 40).map((x) => x.card.id);
  assert.equal(new Set(second).size, 40);
  assert.notEqual(second[0], first[39]);
});

test('kaydedilmiş görülenler bu turda tekrar gelmez; bilinmeyen kimlikler yok sayılır', () => {
  const feed = new Feed(makeCards(10), { rng: mulberry32(2), seen: ['c0', 'c1', 'c2', 'silinmis-kart'] });
  const ids = take(feed, 7).map((x) => x.card.id);
  assert.equal(new Set(ids).size, 7);
  assert.ok(!ids.some((id) => ['c0', 'c1', 'c2'].includes(id)));
  assert.equal(feed.seenIds.length, 10);
});

test('startWith ile kalınan kart ilk gelir', () => {
  const feed = new Feed(makeCards(10), { rng: mulberry32(3), startWith: 'c7' });
  assert.equal(feed.next().card.id, 'c7');
});

test('yanlış cevaplanan kart tam aralıkla yeniden gelir, en fazla 2 kez', () => {
  const feed = new Feed(makeCards(60), { rng: () => 0 }); // aralık = RESHOW_MIN = 5
  const first = feed.next();
  assert.equal(feed.reportWrong(first.card.id, 0), true);
  assert.equal(feed.reportWrong(first.card.id, 0), false, 'beklerken ikinci kez eklenmez');
  const next5 = take(feed, 5);
  assert.equal(next5[4].card.id, first.card.id);
  assert.equal(next5[4].isReshow, true);
  assert.equal(feed.reportWrong(first.card.id, 0), true);
  take(feed, 5);
  assert.equal(feed.reportWrong(first.card.id, 0), false, `en fazla ${RESHOW_LIMIT} kez`);
});

test('önden yüklenen kartlar hesaba katılır (ahead)', () => {
  const feed = new Feed(makeCards(60), { rng: () => 0 });
  const items = take(feed, 4); // kullanıcı 1. kartta, 3 kart önden yüklü
  feed.reportWrong(items[0].card.id, 3);
  const more = take(feed, 2);
  assert.equal(more[1].card.id, items[0].card.id); // 1 + 5 = 6. sırada
});

test('önemli kartlar sıranın başına daha sık düşer', () => {
  const cards = makeCards(100, { importance: (i) => (i < 50 ? 3 : 1) });
  const rng = mulberry32(42);
  let hi = 0;
  let lo = 0;
  for (let r = 0; r < 200; r++) {
    weightedShuffle(cards, rng).forEach((c, pos) => {
      if (c.importance === 3) hi += pos;
      else lo += pos;
    });
  }
  assert.ok(hi < lo * 0.8, `önemli toplam sıra ${hi}, önemsiz ${lo}`);
});

test('spreadOut aynı konuyu art arda ve aynı türü 3 kez art arda dizmez', () => {
  const list = [
    { id: 'a', topic: 'X', type: 'term' }, { id: 'b', topic: 'X', type: 'term' }, { id: 'c', topic: 'Y', type: 'term' },
    { id: 'd', topic: 'Z', type: 'term' }, { id: 'e', topic: 'W', type: 'fact' }, { id: 'f', topic: 'V', type: 'mcq' },
  ].map((c) => ({ course: 'PER245', importance: 2, ...c }));
  const out = spreadOut(list);
  assert.equal(out.length, list.length);
  for (let i = 1; i < out.length; i++) assert.notEqual(out[i].topic, out[i - 1].topic);
  for (let i = 2; i < out.length; i++) assert.ok(!(out[i].type === out[i - 1].type && out[i].type === out[i - 2].type));
});

test('boş akış null döner, tek kartlı akış takılmaz', () => {
  assert.equal(new Feed([]).next(), null);
  const one = new Feed(makeCards(1));
  assert.ok(take(one, 3).every((x) => x.card.id === 'c0'));
});

test('yalnızca terim kartlarına açık/gizli gösterim seçilir', () => {
  const feed = new Feed(makeCards(20), { rng: mulberry32(9) });
  for (const x of take(feed, 20)) {
    if (x.card.type === 'term') assert.ok(['open', 'quiz'].includes(x.variant));
    else assert.equal(x.variant, null);
  }
});
