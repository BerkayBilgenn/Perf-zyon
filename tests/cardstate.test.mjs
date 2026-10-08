import { test } from 'node:test';
import assert from 'node:assert/strict';
import { chooseOption, chooseTrueFalse, completesByDwell, createRecord, markCompleted, reveal, shuffledIndices } from '../site/js/cardstate.js';
import { mulberry32 } from '../site/js/feed.js';
import * as cardstate from '../site/js/cardstate.js';

const mcq = { id: 'm', type: 'mcq', options: ['a', 'b', 'c', 'd'], correct: 2 };
const item = (card, variant = null) => ({ card, key: 'k1', isReshow: false, variant });

test('şık sırası karıştırılır ama doğru cevap izlenir', () => {
  const rec = createRecord(item(mcq), mulberry32(5));
  assert.deepEqual([...rec.optionOrder].sort(), [0, 1, 2, 3]);
  assert.deepEqual(chooseOption(rec, rec.optionOrder.indexOf(2)), { isCorrect: true });
});

test('yalnızca ilk seçim sayılır', () => {
  const rec = createRecord(item(mcq), mulberry32(5));
  const wrong = rec.optionOrder.findIndex((o) => o !== 2);
  assert.deepEqual(chooseOption(rec, wrong), { isCorrect: false });
  assert.equal(chooseOption(rec, rec.optionOrder.indexOf(2)), null);
  const tf = createRecord(item({ id: 't', type: 'tf', isTrue: false }));
  assert.deepEqual(chooseTrueFalse(tf, false), { isCorrect: true });
  assert.equal(chooseTrueFalse(tf, true), null);
});

test('cevap bir kez açılır', () => {
  const rec = createRecord(item({ id: 'f', type: 'flip' }));
  assert.equal(reveal(rec), true);
  assert.equal(reveal(rec), false);
});

test('hangi kartlar 2 sn ekranda kalınca tamamlanır', () => {
  const r = (type, variant) => createRecord(item({ id: type, type, options: ['a', 'b', 'c', 'd'], correct: 0 }, variant));
  assert.equal(completesByDwell(r('fact')), true);
  assert.equal(completesByDwell(r('remember')), true);
  assert.equal(completesByDwell(r('compare')), true);
  assert.equal(completesByDwell(r('term', 'open')), true);
  assert.equal(completesByDwell(r('term', 'quiz')), false);
  assert.equal(completesByDwell(r('flip')), false);
  assert.equal(completesByDwell(r('mcq')), false);
  assert.equal(completesByDwell(r('tf')), false);
});

test('kart yalnızca bir kez tamamlanır', () => {
  const rec = createRecord(item({ id: 'f', type: 'fact' }));
  assert.equal(markCompleted(rec), true);
  assert.equal(markCompleted(rec), false);
});

test('shuffledIndices bir permütasyon üretir', () => {
  assert.deepEqual(shuffledIndices(4, () => 0.999).sort(), [0, 1, 2, 3]);
});

test('yeniden açılan test şık sırasını ve ilk cevabı korur, yeniden puan vermez', () => {
  const rec = createRecord(item(mcq), mulberry32(5));
  const answer = rec.optionOrder.indexOf(2);
  chooseOption(rec, answer);
  markCompleted(rec);
  assert.equal(typeof cardstate.recordSnapshot, 'function');
  const saved = JSON.parse(JSON.stringify(cardstate.recordSnapshot(rec)));
  const resumed = createRecord(item(mcq), mulberry32(99), saved);
  assert.deepEqual(resumed.optionOrder, rec.optionOrder);
  assert.equal(resumed.chosen, answer);
  assert.equal(chooseOption(resumed, answer), null);
  assert.equal(markCompleted(resumed), false);
});

test('yeniden açılan okuma ve gizli terim kartı tamamlanmış kalır', () => {
  for (const [type, variant] of [['fact', null], ['term', 'quiz'], ['flip', null]]) {
    const rec = createRecord(item({ id: type, type }, variant));
    reveal(rec);
    markCompleted(rec);
    assert.equal(typeof cardstate.recordSnapshot, 'function');
    const resumed = createRecord(item(rec.card, 'open'), Math.random, cardstate.recordSnapshot(rec));
    assert.equal(resumed.revealed, true);
    assert.equal(resumed.variant, variant);
    assert.equal(markCompleted(resumed), false);
  }
});

test('başka kartın kaydı ve bozuk kayıt yeni gösterimi etkilemez', () => {
  const rec = createRecord(item(mcq), mulberry32(5), { id: 'other', chosen: 1, completed: true });
  assert.equal(rec.chosen, null);
  assert.equal(rec.completed, false);
  const broken = createRecord(item(mcq), mulberry32(5), { id: 'm', chosen: 4, optionOrder: [0, 0, 1, 2], completed: true });
  assert.equal(broken.chosen, null);
  assert.equal(broken.completed, false);
});
