import { test } from 'node:test';
import assert from 'node:assert/strict';
import { tokenizeBold } from '../site/js/text.js';

test('kalın işaretleri ayrıştırılır', () => {
  assert.deepEqual(tokenizeBold('ACT **480 sn** üzeri'), [
    { text: 'ACT ', bold: false },
    { text: '480 sn', bold: true },
    { text: ' üzeri', bold: false },
  ]);
});

test('işaretsiz ve boş metin', () => {
  assert.deepEqual(tokenizeBold('düz'), [{ text: 'düz', bold: false }]);
  assert.deepEqual(tokenizeBold(''), []);
  assert.deepEqual(tokenizeBold(undefined), []);
});

test('kapanmayan işaret düz metin kalır', () => {
  assert.deepEqual(tokenizeBold('a **b'), [{ text: 'a **b', bold: false }]);
});
