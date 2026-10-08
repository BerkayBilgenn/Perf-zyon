import { test } from 'node:test';
import assert from 'node:assert/strict';
import { GOAL, completeCard, createProgress, recordAnswer, todayKey } from '../site/js/progress.js';

const day1 = new Date(2026, 9, 8, 10, 0);
const day2 = new Date(2026, 9, 9, 9, 0);

test('boş ya da bozuk kayıttan temiz başlangıç', () => {
  for (const saved of [undefined, null, 'x', { filled: -3, lattes: 'çok', totalDone: 1.5, correct: NaN }]) {
    assert.deepEqual(createProgress(saved, day1), { filled: 0, lattes: 0, totalDone: 0, correct: 0, wrong: 0, day: '2026-10-08', doneToday: 0 });
  }
});

test('kayıtlı bar taşmış görünse bile 49’da kalır', () => {
  assert.equal(createProgress({ filled: 80 }, day1).filled, GOAL - 1);
});

test('her kart barı 1 doldurur; 50. kartta latte kazanılır ve bar sıfırlanır', () => {
  let p = createProgress(null, day1);
  let earned = 0;
  for (let i = 0; i < GOAL - 1; i++) {
    const r = completeCard(p, day1);
    p = r.state;
    if (r.earnedLatte) earned += 1;
  }
  assert.equal(p.filled, 49);
  assert.equal(earned, 0);
  const r = completeCard(p, day1);
  assert.equal(r.earnedLatte, true);
  assert.equal(r.state.filled, 0);
  assert.equal(r.state.lattes, 1);
  assert.equal(r.state.totalDone, 50);
  assert.equal(r.state.doneToday, 50);
});

test('gün değişince bugünkü sayaç sıfırdan başlar', () => {
  const p = completeCard(completeCard(createProgress(null, day1), day1).state, day1).state;
  assert.equal(p.doneToday, 2);
  const next = completeCard(p, day2).state;
  assert.equal(next.day, '2026-10-09');
  assert.equal(next.doneToday, 1);
  assert.equal(next.totalDone, 3);
  assert.equal(createProgress(p, day2).doneToday, 0);
});

test('doğru ve yanlış cevaplar sayılır', () => {
  let p = createProgress(null, day1);
  p = recordAnswer(recordAnswer(recordAnswer(p, true), false), true);
  assert.equal(p.correct, 2);
  assert.equal(p.wrong, 1);
});

test('todayKey yerel tarihi YYYY-MM-DD verir', () => {
  assert.equal(todayKey(new Date(2026, 0, 5)), '2026-01-05');
});
