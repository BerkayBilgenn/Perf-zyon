// Gofrikli latte barı ve istatistikler. Saf fonksiyonlar: her çağrı yeni bir durum nesnesi döndürür.
// Puanlar: okunan her kart +1, doğru cevap +2, yanlış cevap −1. 50 puanda bir latte; bar 0'ın altına inmez.
export const GOAL = 50;
export const POINTS = { view: 1, correct: 2, wrong: -1 };

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
    points: count(s.points),
    day: today,
    doneToday: s.day === today ? count(s.doneToday) : 0,
  };
}

export function completeCard(state, { points = POINTS.view, now = new Date() } = {}) {
  const today = todayKey(now);
  let filled = state.filled + points;
  let lattes = state.lattes;
  const earnedLatte = filled >= GOAL;
  if (earnedLatte) {
    filled -= GOAL;
    lattes += 1;
  }
  return {
    state: {
      ...state,
      filled: Math.max(0, filled),
      lattes,
      totalDone: state.totalDone + 1,
      points: Math.max(0, state.points + points),
      day: today,
      doneToday: (state.day === today ? state.doneToday : 0) + 1,
    },
    earnedLatte,
  };
}

export function recordAnswer(state, isCorrect) {
  return isCorrect ? { ...state, correct: state.correct + 1 } : { ...state, wrong: state.wrong + 1 };
}
