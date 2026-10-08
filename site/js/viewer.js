// Kaydırmalı akış: her slayt bir kart. Görünen slaytı izler, önden kart ekler, uzaktaki kartları boşaltır
// (DOM'da en fazla ~25 dolu kart), 2 saniye kuralını ve tamamlanmayı yönetir.
import { completesByDwell, createRecord, markCompleted } from './cardstate.js';
import { renderCard } from './render.js';

export const DWELL_MS = 2000;
export const AHEAD = 4;
export const KEEP = 12;

export function createViewer({ root, feed, handlers, onActive, onComplete, dwellMs = DWELL_MS }) {
  const records = [];
  const slides = [];
  let active = -1;
  let timer = 0;

  function complete(record) {
    if (markCompleted(record)) onComplete?.(record);
  }

  const wrapped = {
    ...handlers,
    onReveal(record) {
      complete(record);
      handlers.onReveal?.(record);
    },
    onAnswer(record, isCorrect) {
      complete(record);
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

  function setActive(i) {
    if (i === active || !records[i]) return;
    active = i;
    clearTimeout(timer);
    if (slides.length - 1 - i < AHEAD) append(AHEAD);
    for (let j = i - 2; j <= i + 2; j++) ensure(j);
    slides.forEach((s, j) => {
      if (Math.abs(j - i) > KEEP && s.firstChild) s.replaceChildren();
    });
    const record = records[i];
    if (!record.completed && completesByDwell(record)) timer = setTimeout(() => complete(record), dwellMs);
    onActive?.(record, i);
  }

  return {
    start() {
      append(AHEAD + 1);
      ensure(0);
      ensure(1);
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
      observer.disconnect();
      root.replaceChildren();
      root.scrollTop = 0;
    },
    get activeRecord() { return records[active] ?? null; },
    get count() { return records.length; },
  };
}
