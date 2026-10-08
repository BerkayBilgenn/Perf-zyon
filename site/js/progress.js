// Gofrikli latte barı ve istatistikler. Saf fonksiyonlar: her çağrı yeni bir durum nesnesi döndürür.
export const GOAL = 50;

export function todayKey(now = new Date()) {
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${now.getFullYear()}-${m}-${d}`;
}

const count = (v) => (Number.isInteger(v) && v >= 0 ? v : 0);

export function createProgress(saved, now = new Date()) {
  const s = saved && typeof saved === 'object' ? saved : {};
  const today = todayKey(now);
  return {
    filled: Math.min(count(s.filled), GOAL - 1),
    lattes: count(s.lattes),
    totalDone: count(s.totalDone),
    correct: count(s.correct),
    wrong: count(s.wrong),
    day: today,
    doneToday: s.day === today ? count(s.doneToday) : 0,
  };
}

export function completeCard(state, now = new Date()) {
  const today = todayKey(now);
  const filled = state.filled + 1;
  const earnedLatte = filled >= GOAL;
  return {
    state: {
      ...state,
      filled: earnedLatte ? 0 : filled,
      lattes: state.lattes + (earnedLatte ? 1 : 0),
      totalDone: state.totalDone + 1,
      day: today,
      doneToday: (state.day === today ? state.doneToday : 0) + 1,
    },
    earnedLatte,
  };
}

export function recordAnswer(state, isCorrect) {
  return isCorrect ? { ...state, correct: state.correct + 1 } : { ...state, wrong: state.wrong + 1 };
}
