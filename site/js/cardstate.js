// Akıştaki tek bir kart gösteriminin etkileşim durumu. DOM'dan bağımsızdır; kart yeniden çizilince durum korunur.
export function shuffledIndices(n, rng = Math.random) {
  const a = [...Array(n).keys()];
  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function createRecord(item, rng = Math.random) {
  return {
    ...item,
    revealed: false,
    chosen: null,
    optionOrder: item.card.type === 'mcq' ? shuffledIndices(item.card.options.length, rng) : null,
    completed: false,
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
