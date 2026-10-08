import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validateCard, cardId, fnv1a, normalizeText } from '../scripts/lib/cards.mjs';

const valid = {
  term: { type: 'term', importance: 3, topic: 'Kardiyopleji', term: 'Kardiyopleji', en: 'Cardioplegia', definition: 'Kalbi diyastolde durduran solüsyon.', origin: 'kardia = kalp' },
  fact: { type: 'fact', importance: 2, topic: 'ACT', title: 'ACT nedir?', body: '**ACT** yatak başı pıhtılaşma testidir.' },
  remember: { type: 'remember', importance: 3, topic: 'ACT', title: 'Hedef', body: 'KPB öncesi ACT kontrol edilir.' },
  flip: { type: 'flip', importance: 2, topic: 'Protamin', question: 'Protamin ne işe yarar?', answer: 'Heparini nötralize eder.' },
  mcq: { type: 'mcq', importance: 2, topic: 'Oksijenatör', question: 'CO2 atılımını ne belirler?', options: ['Sweep gaz akımı', 'FiO2', 'Pompa devri', 'Rezervuar seviyesi'], correct: 0, explanation: 'Sweep gaz akımı.' },
  tf: { type: 'tf', importance: 1, topic: 'Pompalar', statement: 'Santrifügal pompa ard yüke duyarlıdır.', isTrue: true, explanation: 'Direnç artınca akım düşer.' },
  compare: { type: 'compare', importance: 2, topic: 'Pompalar', title: 'Roller ve santrifügal', left: { title: 'Roller', points: ['Oklüzif', 'Akım devre bağlı'] }, right: { title: 'Santrifügal', points: ['Oklüzif değil', 'Akım ölçer gerekir'] } },
};

test('her türün geçerli örneği hatasız geçer', () => {
  for (const [type, card] of Object.entries(valid)) assert.deepEqual(validateCard(card), [], type);
});

test('bilinmeyen tür ve geçersiz önem reddedilir', () => {
  assert.match(validateCard({ ...valid.fact, type: 'quiz' })[0], /bilinmeyen tür/);
  assert.ok(validateCard({ ...valid.fact, importance: 5 }).some((e) => e.includes('importance')));
});

test('uzunluk sınırları uygulanır', () => {
  const errs = validateCard({ ...valid.term, definition: 'a'.repeat(321) });
  assert.ok(errs.some((e) => e.includes('definition') && e.includes('321/320')));
});

test('test kartı kuralları', () => {
  assert.ok(validateCard({ ...valid.mcq, options: ['a', 'b', 'c'] }).some((e) => e.includes('4 şık')));
  assert.ok(validateCard({ ...valid.mcq, correct: 4 }).some((e) => e.includes('correct')));
  assert.ok(validateCard({ ...valid.mcq, options: ['x', 'X', 'y', 'z'] }).some((e) => e.includes('aynı şık')));
  assert.ok(validateCard({ ...valid.mcq, options: ['Hepsi', 'b', 'c', 'd'] }).some((e) => e.includes('karıştırılınca')));
  assert.ok(validateCard({ ...valid.mcq, options: ['A ve B', 'b', 'c', 'd'] }).some((e) => e.includes('karıştırılınca')));
});

test('doğru/yanlış ve karşılaştırma kuralları', () => {
  assert.ok(validateCard({ ...valid.tf, isTrue: 'true' }).some((e) => e.includes('isTrue')));
  assert.ok(validateCard({ ...valid.compare, left: { title: 'Roller', points: ['tek'] } }).some((e) => e.includes('left.points')));
});

test('tanınmayan alan ve eşleşmeyen ** reddedilir', () => {
  assert.ok(validateCard({ ...valid.fact, extra: 1 }).some((e) => e.includes('tanınmayan alan')));
  assert.ok(validateCard({ ...valid.fact, body: '**ACT yatak başı' }).some((e) => e.includes('**')));
});

test('isteğe bağlı kaynak alanı kabul edilir ama boş olamaz', () => {
  assert.deepEqual(validateCard({ ...valid.fact, source: 'EACTS 2024' }), []);
  assert.ok(validateCard({ ...valid.fact, source: ' ' }).some((e) => e.includes('source')));
});

test('fnv1a bilinen değerleri üretir', () => {
  assert.equal(fnv1a(''), 0x811c9dc5);
  assert.equal(fnv1a('a'), 0xe40c292c);
});

test('cardId büyük/küçük harf ve boşluk farkını yok sayar, Türkçe İ/i doğru', () => {
  const a = cardId('PER245', { ...valid.term, term: 'İnotrop' });
  const b = cardId('PER245', { ...valid.term, term: '  inotrop ' });
  assert.equal(a, b);
  assert.match(a, /^PER245-[0-9a-z]{7}$/);
  assert.notEqual(a, cardId('PER245', { ...valid.term, term: 'Kronotrop' }));
  assert.notEqual(a, cardId('PER243', { ...valid.term, term: 'İnotrop' }));
});

test('normalizeText Türkçe küçük harfe çevirir', () => {
  assert.equal(normalizeText('  IŞIK  Ağır '), 'ışık ağır');
});
