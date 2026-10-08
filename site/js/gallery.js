// Geliştirme vitrini: her türden bir kart, gizli terim gösterimi ve her türün en uzun kartı (taşma denetimi için).
import { loadAllCards } from './data.js';
import { createRecord } from './cardstate.js';
import { renderCard } from './render.js';

const TYPES = ['term', 'fact', 'flip', 'mcq', 'tf', 'remember', 'compare'];
const size = (card) => JSON.stringify(card).length;
const handlers = {
  isSaved: () => false,
  isFlagged: () => false,
  onToggleSave: () => true,
  onToggleFlag: () => true,
  onReveal: () => {},
  onAnswer: () => {},
};
const item = (card, variant = card.type === 'term' ? 'open' : null, isReshow = false) => ({ card, key: `g-${card.id}-${variant}`, isReshow, variant });

async function main() {
  const html = await (await fetch('index.html')).text();
  const sprite = new DOMParser().parseFromString(html, 'text/html').querySelector('svg.sprite');
  if (sprite) document.body.prepend(document.importNode(sprite, true));
  const { cards } = await loadAllCards();
  const root = document.querySelector('#gallery');
  const section = (title, items) => {
    root.append(Object.assign(document.createElement('h2'), { textContent: title }));
    for (const it of items) root.append(renderCard(createRecord(it), handlers));
  };
  const firsts = TYPES.map((t) => cards.find((c) => c.type === t)).filter(Boolean);
  const term = cards.find((c) => c.type === 'term');
  section('Her türden bir kart', [...firsts.map((c) => item(c)), ...(term ? [item(term, 'quiz', true)] : [])]);
  const longest = TYPES.map((t) => cards.filter((c) => c.type === t).sort((a, b) => size(b) - size(a))[0]).filter(Boolean);
  section('Her türün en uzun kartı', longest.map((c) => item(c)));
  document.body.dataset.ready = 'true';
}
main();
