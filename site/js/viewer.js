// Kaydırmalı akış: her slayt bir kart. Görünen slaytı izler, önden kart ekler, uzaktaki kartları boşaltır
// (DOM'da en fazla ~25 dolu kart), 2 saniye kuralını ve tamamlanmayı yönetir.
import { completesByDwell, createRecord, markCompleted } from './cardstate.js';
import { POINTS } from './progress.js';
import { renderCard } from './render.js';

export const DWELL_MS = 2000;
export const AHEAD = 4;
export const KEEP = 12;
export const IDLE_MS = 150;

export function createViewer({ root, feed, handlers, onActive, onComplete, dwellMs = DWELL_MS }) {
  const records = [];
  const slides = [];
  let active = -1;
  let timer = 0;
  let idleTimer = 0;

  // Puan: okunan kart +1, doğru cevap +2, yanlış cevap −1. Akıştaki bir kart yalnızca bir kez puan verir.
  function complete(record, points = POINTS.view) {
    if (markCompleted(record)) onComplete?.(record, points);
  }

  const wrapped = {
    ...handlers,
    onReveal(record) {
      complete(record, POINTS.view);
      handlers.onReveal?.(record);
    },
    onAnswer(record, isCorrect) {
      complete(record, isCorrect ? POINTS.correct : POINTS.wrong);
      handlers.onAnswer?.(record, isCorrect, records.length - 1 - records.indexOf(record));
    },
  };

  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting && entry.intersectionRatio >= 0.6) setActive(Number(entry.target.dataset.index));
    }
  }, { root, threshold: [0.6] });

  function append(n) {
    for (let i = 0; i < n; i++) {
      const item = feed.next();
      if (!item) return;
      const index = records.length;
      records.push(createRecord(item));
      const slide = document.createElement('section');
      slide.className = 'slide';
      slide.dataset.index = String(index);
      slide.setAttribute('aria-label', `Kart ${index + 1}`);
      slides.push(slide);
      root.append(slide);
      observer.observe(slide);
    }
  }

  function ensure(i) {
    const slide = slides[i];
    if (slide && !slide.firstChild) slide.append(renderCard(records[i], wrapped));
  }

  // Kaydırma sürerken DOM değişirse WebKit (iPhone Safari) yeniden hizalanıp bir kart atlıyor.
  // Bu yüzden görünür kart değişince yalnızca sayaç ve kayıt güncellenir; slayt ekleme, kart çizme ve
  // uzaktakileri boşaltma işi kaydırma durunca (scrollend ya da son kaydırmadan 150 ms sonra) yapılır.
  function settle() {
    idleTimer = 0;
    if (active < 0) return;
    if (slides.length - 1 - active < AHEAD) append(AHEAD);
    for (let j = active - 2; j <= active + 3; j++) ensure(j);
    slides.forEach((s, j) => {
      if (Math.abs(j - active) > KEEP && s.firstChild) s.replaceChildren();
    });
  }

  function scheduleSettle() {
    clearTimeout(idleTimer);
    idleTimer = setTimeout(settle, IDLE_MS);
  }

  const onScroll = () => {
    if (idleTimer) scheduleSettle();
  };
  const onScrollEnd = () => {
    if (!idleTimer) return;
    clearTimeout(idleTimer);
    settle();
  };
  root.addEventListener('scroll', onScroll, { passive: true });
  root.addEventListener('scrollend', onScrollEnd);

  function setActive(i) {
    if (i === active || !records[i]) return;
    active = i;
    clearTimeout(timer);
    const record = records[i];
    if (!record.completed && completesByDwell(record)) timer = setTimeout(() => complete(record), dwellMs);
    onActive?.(record, i);
    scheduleSettle();
  }

  return {
    start() {
      append(AHEAD + 1);
      for (let j = 0; j <= 3; j++) ensure(j);
      root.scrollTop = 0;
    },
    step(dir) {
      const target = slides[active + dir];
      if (!target) return;
      const smooth = !matchMedia('(prefers-reduced-motion: reduce)').matches;
      root.scrollTo({ top: target.offsetTop, behavior: smooth ? 'smooth' : 'auto' });
    },
    destroy() {
      clearTimeout(timer);
      clearTimeout(idleTimer);
      root.removeEventListener('scroll', onScroll);
      root.removeEventListener('scrollend', onScrollEnd);
      observer.disconnect();
      root.replaceChildren();
      root.scrollTop = 0;
    },
    get activeRecord() { return records[active] ?? null; },
    get count() { return records.length; },
  };
}
