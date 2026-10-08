// Kart şeması: doğrulama ve kalıcı kimlik üretimi. Derleme betiği ve testler kullanır.
export const COURSE_CODES = ['PER141', 'PER207', 'PER241', 'PER243', 'PER245', 'PER247'];
export const TYPES = ['term', 'fact', 'flip', 'mcq', 'tf', 'remember', 'compare'];
export const TARGET_SHARE = { term: 0.4, fact: 0.18, mcq: 0.15, flip: 0.1, tf: 0.08, remember: 0.05, compare: 0.04 };
export const LIMITS = {
  topic: 48, term: 60, en: 80, definition: 320, origin: 120, title: 70, body: 320, question: 200,
  answer: 320, option: 90, explanation: 240, statement: 220, sideTitle: 40, point: 90, source: 80,
};

const FIELDS = {
  term: ['term', 'en', 'definition', 'origin'],
  fact: ['title', 'body'],
  remember: ['title', 'body'],
  flip: ['question', 'answer'],
  mcq: ['question', 'options', 'correct', 'explanation'],
  tf: ['statement', 'isTrue', 'explanation'],
  compare: ['title', 'left', 'right'],
};
const COMMON = ['type', 'importance', 'topic', 'source', 'id', 'course'];

const isText = (v) => typeof v === 'string' && v.trim().length > 0;

export function normalizeText(s) {
  return String(s ?? '').normalize('NFC').toLocaleLowerCase('tr').replace(/\s+/g, ' ').trim();
}

// Şıklar ekranda karıştırıldığı için sıraya bağlı şıklar ("Hepsi", "A ve B") yasaktır.
export function orderDependentOption(text) {
  const t = normalizeText(text);
  return /(^|[^a-zçğıöşü])(hepsi|hiçbiri|yukarıdaki)/u.test(t) || /(^|\s)[a-e] ve [a-e](\s|$|[.,])/u.test(t);
}

function checkText(errors, obj, field, max, label = field, required = true) {
  const v = obj?.[field];
  if (v === undefined && !required) return;
  if (!isText(v)) {
    errors.push(`"${label}" eksik veya boş`);
    return;
  }
  if (v.length > max) errors.push(`"${label}" çok uzun (${v.length}/${max})`);
  if ((v.match(/\*\*/g) ?? []).length % 2 !== 0) errors.push(`"${label}" içinde kalın yazı işaretleri (**) eşleşmiyor`);
}

export function validateCard(card) {
  if (!card || typeof card !== 'object' || Array.isArray(card)) return ['kart bir nesne olmalı'];
  if (!TYPES.includes(card.type)) return [`bilinmeyen tür: ${card.type}`];
  const errors = [];
  if (![1, 2, 3].includes(card.importance)) errors.push('"importance" 1, 2 veya 3 olmalı');
  checkText(errors, card, 'topic', LIMITS.topic);
  checkText(errors, card, 'source', LIMITS.source, 'source', false);
  switch (card.type) {
    case 'term':
      checkText(errors, card, 'term', LIMITS.term);
      checkText(errors, card, 'en', LIMITS.en, 'en', false);
      checkText(errors, card, 'definition', LIMITS.definition);
      checkText(errors, card, 'origin', LIMITS.origin, 'origin', false);
      break;
    case 'fact':
    case 'remember':
      checkText(errors, card, 'title', LIMITS.title);
      checkText(errors, card, 'body', LIMITS.body);
      break;
    case 'flip':
      checkText(errors, card, 'question', LIMITS.question);
      checkText(errors, card, 'answer', LIMITS.answer);
      break;
    case 'mcq': {
      checkText(errors, card, 'question', LIMITS.question);
      checkText(errors, card, 'explanation', LIMITS.explanation);
      const { options } = card;
      if (!Array.isArray(options) || options.length !== 4) {
        errors.push('"options" tam 4 şık olmalı');
      } else {
        options.forEach((_, i) => checkText(errors, options, i, LIMITS.option, `şık ${i + 1}`));
        options.forEach((o, i) => {
          if (isText(o) && orderDependentOption(o)) errors.push(`şık ${i + 1} karıştırılınca anlamını kaybeder: "${o}"`);
        });
        const norm = options.filter(isText).map(normalizeText);
        if (new Set(norm).size !== norm.length) errors.push('aynı şık iki kez yazılmış');
      }
      if (!Number.isInteger(card.correct) || card.correct < 0 || card.correct > 3) errors.push('"correct" 0-3 arası tam sayı olmalı');
      break;
    }
    case 'tf':
      checkText(errors, card, 'statement', LIMITS.statement);
      checkText(errors, card, 'explanation', LIMITS.explanation);
      if (typeof card.isTrue !== 'boolean') errors.push('"isTrue" true veya false olmalı');
      break;
    case 'compare':
      checkText(errors, card, 'title', LIMITS.title, 'title', false);
      for (const side of ['left', 'right']) {
        const s = card[side];
        if (!s || typeof s !== 'object') {
          errors.push(`"${side}" eksik`);
          continue;
        }
        checkText(errors, s, 'title', LIMITS.sideTitle, `${side}.title`);
        if (!Array.isArray(s.points) || s.points.length < 2 || s.points.length > 4) errors.push(`"${side}.points" 2-4 madde olmalı`);
        else s.points.forEach((_, i) => checkText(errors, s.points, i, LIMITS.point, `${side}.points[${i + 1}]`));
      }
      break;
  }
  const allowed = new Set([...COMMON, ...FIELDS[card.type]]);
  for (const key of Object.keys(card)) if (!allowed.has(key)) errors.push(`tanınmayan alan: "${key}"`);
  return errors;
}

export function primaryText(card) {
  switch (card.type) {
    case 'term': return card.term;
    case 'fact':
    case 'remember': return `${card.title}|${card.body}`;
    case 'flip':
    case 'mcq': return card.question;
    case 'tf': return card.statement;
    case 'compare': return `${card.left?.title}|${card.right?.title}`;
    default: return '';
  }
}

export function fnv1a(str) {
  let h = 0x811c9dc5;
  for (const ch of str) {
    h ^= ch.codePointAt(0);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h >>> 0;
}

// Kimlik, kartın ana metninden türetilir: aynı kart iki kez yazılırsa aynı kimliği alır ve derleme bunu yakalar.
export function cardId(course, card) {
  const key = `${card.type}|${normalizeText(primaryText(card))}`;
  return `${course}-${fnv1a(key).toString(36).padStart(7, '0')}`;
}
