// Giriş noktası: kartları yükler, akışı kurar, latte barını, filtreyi ve menüyü bağlar.
import { COURSES, COURSE_BY_CODE, loadAllCards } from './data.js';
import { Feed } from './feed.js';
import { completeCard, createProgress, recordAnswer } from './progress.js';
import { createStore } from './store.js';
import { createUI } from './ui.js';
import { createViewer } from './viewer.js';

const store = createStore();
const ui = createUI();
const fmt = (n) => n.toLocaleString('tr-TR');
const asArray = (v) => (Array.isArray(v) ? v : []);
const THEMES = ['system', 'light', 'dark'];

let allCards = [];
let failedCourses = [];
let feed = null;
let viewer = null;
let progress = createProgress(store.get('progress'));
const saved = new Set(asArray(store.get('saved')).filter((id) => typeof id === 'string'));
const flags = asArray(store.get('flags')).filter((f) => f && typeof f.id === 'string');
let filter = typeof store.get('filter') === 'string' ? store.get('filter') : 'all';
let theme = THEMES.includes(store.get('theme')) ? store.get('theme') : 'system';
let persistTimer = 0;

const saveProgress = () => store.set('progress', progress);

function cardsFor(f) {
  if (f === 'saved') return allCards.filter((c) => saved.has(c.id));
  if (COURSE_BY_CODE.has(f)) return allCards.filter((c) => c.course === f);
  return allCards;
}

function labelFor(f) {
  if (f === 'saved') return '🔖 Kaydettiklerim';
  return COURSE_BY_CODE.get(f)?.short ?? 'Tümü';
}

function persistSeen() {
  clearTimeout(persistTimer);
  const f = filter;
  const current = feed;
  persistTimer = setTimeout(() => {
    if (current) store.set(`seen:${f}`, current.seenIds);
  }, 500);
}

const handlers = {
  isSaved: (id) => saved.has(id),
  isFlagged: (id) => flags.some((f) => f.id === id),
  onToggleSave(card) {
    if (saved.has(card.id)) saved.delete(card.id);
    else saved.add(card.id);
    store.set('saved', [...saved]);
    const on = saved.has(card.id);
    ui.toast(on ? 'Kaydedildi 🔖 Filtreden “Kaydettiklerim”i seçip tekrar edebilirsin.' : 'Kayıtlardan çıkarıldı');
    return on;
  },
  onToggleFlag(card) {
    const i = flags.findIndex((f) => f.id === card.id);
    if (i >= 0) flags.splice(i, 1);
    else flags.push({ id: card.id, at: Date.now() });
    store.set('flags', flags);
    ui.toast(i >= 0 ? 'İşaret kaldırıldı' : 'İşaretlendi ⚑ Menüden listeyi kopyalayıp gönderebilirsin.');
    return i < 0;
  },
  onAnswer(record, isCorrect, ahead) {
    progress = recordAnswer(progress, isCorrect);
    saveProgress();
    if (!isCorrect) feed?.reportWrong(record.card.id, ahead);
  },
};

function onActive(record) {
  store.set(`current:${filter}`, record.card.id);
  persistSeen();
}

function onComplete(record, points) {
  const result = completeCard(progress, { points });
  progress = result.state;
  saveProgress();
  ui.setProgress(progress, { bump: true, delta: points });
  if (result.earnedLatte) ui.celebrate(progress.lattes);
}

function startFeed() {
  viewer?.destroy();
  viewer = null;
  feed = null;
  ui.setFilterLabel(labelFor(filter));
  const cards = cardsFor(filter);
  if (!cards.length) {
    ui.showEmpty(filter === 'saved'
      ? { title: 'Burada henüz kart yok', text: 'Beğendiğin kartlarda “Kaydet”e dokun, hepsi burada toplansın.', onBack: () => pickFilter('all') }
      : { title: 'Bu dersin kartları açılamadı', text: 'Diğer derslerle devam edebilirsin.', onBack: () => pickFilter('all') });
    return;
  }
  ui.hideEmpty();
  feed = new Feed(cards, { seen: asArray(store.get(`seen:${filter}`)), startWith: store.get(`current:${filter}`) });
  viewer = createViewer({ root: ui.feedEl, feed, handlers, onActive, onComplete });
  viewer.start();
}

function pickFilter(value) {
  if (value === filter && viewer) return;
  filter = value;
  store.set('filter', filter);
  startFeed();
}

function openFilter() {
  const options = [
    { value: 'all', title: 'Tümü', sub: 'Bütün dersler karışık', countText: fmt(allCards.length) },
    ...COURSES.map((c) => {
      const n = allCards.filter((x) => x.course === c.code).length;
      const failed = failedCourses.includes(c.code);
      return { value: c.code, title: c.name, sub: failed ? `${c.code} · şu an açılamadı` : c.code, countText: failed ? '—' : fmt(n), disabled: failed || n === 0 };
    }),
    { value: 'saved', title: 'Kaydettiklerim', sub: 'Kaydet’e dokunduğun kartlar', countText: fmt(allCards.filter((c) => saved.has(c.id)).length) },
  ];
  ui.openFilter({ current: filter, options, onPick: pickFilter });
}

function summary(card) {
  if (!card) return '(artık bulunmayan kart)';
  const text = card.term ?? card.title ?? card.question ?? card.statement ?? `${card.left?.title} / ${card.right?.title}`;
  return `${card.course} · ${text}`;
}

function copyFlags(items) {
  const text = ['“Hatalı olabilir” dediğim kartlar:', ...items.map((f) => `- ${f.label} [${f.id}]`)].join('\n');
  const fallback = () => {
    ui.showCopyFallback(text);
    ui.toast('Metni seçtim, kopyalayıp gönderebilirsin.');
  };
  try {
    navigator.clipboard.writeText(text).then(() => ui.toast('Liste kopyalandı 📋'), fallback);
  } catch {
    fallback();
  }
}

function setTheme(choice) {
  theme = choice;
  store.set('theme', theme);
  ui.applyTheme(theme);
}

function resetProgress() {
  progress = createProgress(null);
  saveProgress();
  for (const f of ['all', 'saved', ...COURSES.map((c) => c.code)]) {
    store.remove(`seen:${f}`);
    store.remove(`current:${f}`);
  }
  ui.setProgress(progress);
  ui.toast('İlerleme sıfırlandı. Yeni bir başlangıç ✨');
  startFeed();
}

function openMenu() {
  const byId = new Map(allCards.map((c) => [c.id, c]));
  const items = flags.map((f) => ({ id: f.id, label: summary(byId.get(f.id)) }));
  ui.openMenu({ progress, theme, flags: items, onTheme: setTheme, onCopy: () => copyFlags(items), onReset: resetProgress });
}

document.addEventListener('keydown', (e) => {
  if (ui.isCelebrating()) {
    if (e.key === 'Escape') ui.closeCelebration();
    return;
  }
  if (document.querySelector('dialog[open]')) return;
  const onControl = e.target.closest?.('button, input, textarea, select');
  if (e.key === ' ' && onControl) return;
  if (e.key === 'ArrowDown' || e.key === 'PageDown' || (e.key === ' ' && !e.shiftKey)) {
    e.preventDefault();
    viewer?.step(1);
  } else if (e.key === 'ArrowUp' || e.key === 'PageUp' || (e.key === ' ' && e.shiftKey)) {
    e.preventDefault();
    viewer?.step(-1);
  }
});

async function load() {
  ui.showLoading();
  try {
    const result = await loadAllCards();
    allCards = result.cards;
    failedCourses = result.failed;
  } catch {
    ui.showError('İnternet bağlantını kontrol edip tekrar dene.', load);
    return;
  }
  ui.hideLoading();
  if (failedCourses.length) ui.toast(`${failedCourses.join(', ')} kartları şu an açılamadı; diğer dersler hazır.`);
  if (filter !== 'all' && filter !== 'saved' && !allCards.some((c) => c.course === filter)) filter = 'all';
  startFeed();
  if (!store.get('hintSeen', false)) {
    ui.showHint();
    ui.toast('Her kart +1, doğru cevap +2, yanlış −1 puan. 50 puanda bir Gofrikli latte! ☕');
    store.set('hintSeen', true);
  }
}

ui.applyTheme(theme);
ui.paintSky();
ui.setProgress(progress);
ui.bind({ onOpenFilter: openFilter, onOpenMenu: openMenu });
load();
