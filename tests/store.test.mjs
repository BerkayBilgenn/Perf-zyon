import { test } from 'node:test';
import assert from 'node:assert/strict';
import { browserBackend, createStore, memoryBackend } from '../site/js/store.js';

const throwing = {
  getItem() { throw new Error('engelli'); },
  setItem() { throw new Error('kota doldu'); },
  removeItem() { throw new Error('engelli'); },
};

test('değer yazılır ve okunur, önek ayrımı yapılır', () => {
  const backend = memoryBackend();
  const a = createStore(backend, 'a:');
  const b = createStore(backend, 'b:');
  assert.equal(a.set('x', { n: 1 }), true);
  assert.deepEqual(a.get('x'), { n: 1 });
  assert.equal(b.get('x', 'yok'), 'yok');
});

test('bozuk JSON ve eksik anahtar varsayılanı döndürür', () => {
  const backend = memoryBackend();
  backend.setItem('dep:x', '{bozuk');
  const s = createStore(backend);
  assert.equal(s.get('x', 7), 7);
  assert.equal(s.get('yok', null), null);
});

test('hata fırlatan depolama uygulamayı durdurmaz', () => {
  const s = createStore(throwing);
  assert.equal(s.get('x', 'varsayılan'), 'varsayılan');
  assert.equal(s.set('x', 1), false);
  assert.doesNotThrow(() => s.remove('x'));
});

test('browserBackend her ortamda yazılıp okunabilen bir depo döndürür', () => {
  const b = browserBackend();
  b.setItem('k', 'v');
  assert.equal(b.getItem('k'), 'v');
});
