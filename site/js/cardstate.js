// Akıştaki tek bir kart gösteriminin etkileşim durumu. DOM'dan bağımsızdır; kart yeniden çizilince durum korunur.
export function shuffledIndices(n, rng = Math.random) {
  const a = [...Array(n).keys()];
  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function createRecord(item, rng = Math.random, saved = null) {
  const record = {
    ...item,
    revealed: false,
    chosen: null,
    optionOrder: item.card.type === 'mcq' ? shuffledIndices(item.card.options.length, rng) : null,
    completed: false,
  };
  if (!saved || saved.id !== item.card.id || typeof saved.completed !== 'boolean' || typeof saved.revealed !== 'boolean') return record;
  if (item.card.type === 'mcq') {
    if (!Array.isArray(saved.optionOrder) || saved.optionOrder.length !== 4 || [...saved.optionOrder].sort().join(',') !== '0,1,2,3') return record;
    if (saved.chosen !== null && (!Number.isInteger(saved.chosen) || saved.chosen < 0 || saved.chosen > 3)) return record;
    record.optionOrder = [...saved.optionOrder];
  } else if (item.card.type === 'tf') {
    if (saved.chosen !== null && typeof saved.chosen !== 'boolean') return record;
  } else if (saved.chosen !== null) return record;
  if (item.card.type === 'term' && !['quiz', 'open'].includes(saved.variant)) return record;
  return { ...record, chosen: saved.chosen, completed: saved.completed, revealed: saved.revealed, variant: saved.variant };
}

// Yalnızca etkileşim durumu saklanır; kart metni güncel veri dosyasından okunur.
export function recordSnapshot(record) {
  return {
    id: record.card.id, variant: record.variant, revealed: record.revealed,
    chosen: record.chosen, optionOrder: record.optionOrder, completed: record.completed,
  };
}

// `displayIndex`: şıkkın ekrandaki sırası. Yalnızca ilk seçim sayılır.
export function chooseOption(record, displayIndex) {
  if (record.chosen !== null) return null;
  record.chosen = displayIndex;
  return { isCorrect: record.optionOrder[displayIndex] === record.card.correct };
}

export function chooseTrueFalse(record, answer) {
  if (record.chosen !== null) return null;
  record.chosen = answer;
  return { isCorrect: answer === record.card.isTrue };
}

export function reveal(record) {
  if (record.revealed) return false;
  record.revealed = true;
  return true;
}

export function completesByDwell(record) {
  const { type } = record.card;
  if (type === 'term') return record.variant !== 'quiz';
  return type === 'fact' || type === 'remember' || type === 'compare';
}

export function markCompleted(record) {
  if (record.completed) return false;
  record.completed = true;
  return true;
}
