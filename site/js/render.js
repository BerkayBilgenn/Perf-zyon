// Kart türü → DOM. Metin her zaman textContent ile yazılır. Etkileşim durumu kayıttan (record) okunur;
// böylece uzaktaki bir kart boşaltılıp yeniden çizildiğinde açılan cevap ve seçilen şık korunur.
import { COURSE_BY_CODE } from './data.js';
import { chooseOption, chooseTrueFalse, reveal } from './cardstate.js';
import { tokenizeBold } from './text.js';

export const TYPE_LABEL = {
  term: '📖 Terim',
  fact: '💊 Hap bilgi',
  flip: '🤔 Soru',
  mcq: '✅ Test',
  tf: '⚖️ Doğru mu, yanlış mı?',
  remember: '⚠️ Bunu unutma!',
  compare: '🔀 Karıştırma!',
};
const LETTERS = ['A', 'B', 'C', 'D'];
const SVG_NS = 'http://www.w3.org/2000/svg';

function el(tag, attrs = {}, ...children) {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (v == null || v === false) continue;
    if (k === 'class') node.className = v;
    else if (k === 'text') node.textContent = v;
    else node.setAttribute(k, v === true ? '' : String(v));
  }
  for (const c of children.flat()) if (c != null && c !== false) node.append(c);
  return node;
}

function rich(tag, text, attrs = {}) {
  const node = el(tag, attrs);
  for (const part of tokenizeBold(text)) node.append(part.bold ? el('strong', { text: part.text }) : part.text);
  return node;
}

export function icon(id, cls = 'icon') {
  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('class', cls);
  svg.setAttribute('aria-hidden', 'true');
  const use = document.createElementNS(SVG_NS, 'use');
  use.setAttribute('href', `#${id}`);
  svg.append(use);
  return svg;
}

function scrollCardToEnd(cardEl) {
  requestAnimationFrame(() => {
    if (cardEl.scrollHeight > cardEl.clientHeight) cardEl.scrollTo({ top: cardEl.scrollHeight, behavior: 'smooth' });
  });
}

function meta(record) {
  const { card } = record;
  const course = COURSE_BY_CODE.get(card.course);
  return el('header', { class: 'card__meta' },
    el('div', { class: 'card__tags' },
      el('span', { class: 'tag', text: TYPE_LABEL[card.type] }),
      card.importance === 3 ? el('span', { class: 'tag tag--hot', text: '⭐ Çok önemli' }) : null,
      record.isReshow ? el('span', { class: 'tag tag--again', text: '🔁 Tekrar' }) : null),
    el('p', { class: 'card__course' }, el('strong', { text: card.course }), course ? ` · ${course.name}` : ''),
    el('p', { class: 'card__topic', text: card.topic }));
}

function actions(card, h) {
  const save = el('button', { type: 'button', class: 'act act--save', 'aria-pressed': String(h.isSaved(card.id)) }, icon('i-bookmark'), 'Kaydet');
  save.addEventListener('click', () => save.setAttribute('aria-pressed', String(h.onToggleSave(card))));
  const flag = el('button', { type: 'button', class: 'act act--flag', 'aria-pressed': String(h.isFlagged(card.id)) }, icon('i-flag'), 'Hatalı olabilir');
  flag.addEventListener('click', () => flag.setAttribute('aria-pressed', String(h.onToggleFlag(card))));
  return el('footer', { class: 'card__actions' }, save, flag, card.source ? el('p', { class: 'card__source', text: `Kaynak: ${card.source}` }) : null);
}

function revealBlock(record, h, label, content) {
  const answer = el('div', { class: 'answer', hidden: !record.revealed }, content);
  const btn = el('button', { type: 'button', class: 'reveal-btn', hidden: record.revealed }, label);
  btn.addEventListener('click', () => {
    if (!reveal(record)) return;
    btn.hidden = true;
    answer.hidden = false;
    answer.classList.add('pop-in');
    h.onReveal(record);
  });
  return [btn, answer];
}

function showVerdict(box, verdict, ok, wrongText) {
  verdict.textContent = ok ? 'Doğru! 🎉' : `Bu sefer olmadı 💕 ${wrongText}`;
  box.hidden = false;
  box.classList.toggle('is-good', ok);
  box.classList.toggle('is-bad', !ok);
}

function choiceBody({ record, h, cardEl, prompt, groupClass, groupLabel, buttons, correctAt, choose, wrongText, explanation }) {
  const verdict = el('p', { class: 'explain__verdict' });
  const box = el('div', { class: 'explain', hidden: true }, verdict, rich('p', explanation));
  const paint = () => {
    if (record.chosen === null) return;
    const chosenAt = buttons.findIndex((b) => b.dataset.value === String(record.chosen));
    buttons.forEach((b, i) => {
      b.disabled = true;
      b.classList.toggle('is-correct', i === correctAt);
      b.classList.toggle('is-wrong', i === chosenAt && i !== correctAt);
      b.classList.toggle('is-dim', i !== correctAt && i !== chosenAt);
    });
    showVerdict(box, verdict, chosenAt === correctAt, wrongText);
  };
  buttons.forEach((b) => b.addEventListener('click', () => {
    const result = choose(b.dataset.value);
    if (!result) return;
    paint();
    scrollCardToEnd(cardEl);
    h.onAnswer(record, result.isCorrect);
  }));
  paint();
  return [prompt, el('div', { class: groupClass, role: 'group', 'aria-label': groupLabel }, buttons), box];
}

const BODIES = {
  term(record, h) {
    const c = record.card;
    const word = el('p', { class: 'term__word', text: c.term });
    const en = c.en ? el('p', { class: 'term__en', lang: 'en', text: c.en }) : null;
    const def = rich('p', c.definition, { class: 'card__text' });
    const origin = c.origin ? el('p', { class: 'term__origin' }, icon('i-sparkle', 'icon--tiny'), c.origin) : null;
    if (record.variant !== 'quiz') return [word, en, def, origin];
    return [el('p', { class: 'ask', text: 'Bu terim ne demek?' }), word, en, ...revealBlock(record, h, 'Anlamını gör ✨', [def, origin])];
  },
  fact: (record) => [el('h3', { class: 'card__title', text: record.card.title }), rich('p', record.card.body, { class: 'card__text' })],
  remember: (record) => [el('h3', { class: 'card__title', text: record.card.title }), rich('p', record.card.body, { class: 'card__text' })],
  flip(record, h) {
    const c = record.card;
    return [rich('p', c.question, { class: 'q' }), ...revealBlock(record, h, 'Cevabı gör ✨', [rich('p', c.answer, { class: 'card__text' })])];
  },
  mcq(record, h, cardEl) {
    const c = record.card;
    const buttons = record.optionOrder.map((orig, i) =>
      el('button', { type: 'button', class: 'opt', 'data-value': i }, el('span', { class: 'opt__letter', text: LETTERS[i] }), rich('span', c.options[orig], { class: 'opt__text' })));
    const correctAt = record.optionOrder.indexOf(c.correct);
    return choiceBody({
      record, h, cardEl, buttons, correctAt,
      prompt: rich('p', c.question, { class: 'q' }),
      groupClass: 'options',
      groupLabel: 'Şıklar',
      choose: (value) => chooseOption(record, Number(value)),
      wrongText: `Doğru cevap: ${LETTERS[correctAt]}`,
      explanation: c.explanation,
    });
  },
  tf(record, h, cardEl) {
    const c = record.card;
    const buttons = [
      el('button', { type: 'button', class: 'opt', 'data-value': 'true' }, 'Doğru ✓'),
      el('button', { type: 'button', class: 'opt', 'data-value': 'false' }, 'Yanlış ✗'),
    ];
    return choiceBody({
      record, h, cardEl, buttons,
      correctAt: c.isTrue ? 0 : 1,
      prompt: rich('p', c.statement, { class: 'q' }),
      groupClass: 'tf',
      groupLabel: 'Doğru mu, yanlış mı?',
      choose: (value) => chooseTrueFalse(record, value === 'true'),
      wrongText: `Cevap: ${c.isTrue ? 'Doğru' : 'Yanlış'}`,
      explanation: c.explanation,
    });
  },
  compare(record) {
    const c = record.card;
    const side = (s) => el('div', { class: 'side' }, el('h4', { text: s.title }), el('ul', {}, s.points.map((p) => rich('li', p))));
    return [c.title ? el('h3', { class: 'card__title', text: c.title }) : null, el('div', { class: 'compare' }, side(c.left), side(c.right))];
  },
};

export function renderCard(record, h) {
  const cardEl = el('article', { class: 'card', 'data-type': record.card.type, 'data-key': record.key, lang: 'tr' });
  cardEl.append(
    icon('i-sparkle', 'card__deco'),
    meta(record),
    el('div', { class: 'card__body' }, BODIES[record.card.type](record, h, cardEl)),
    actions(record.card, h),
  );
  return cardEl;
}
