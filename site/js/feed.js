// Akış sırası: önem ağırlıklı karıştırma, tür/konu yayma, turlar ve yanlış cevaplananların tekrarı. DOM kullanmaz.
export const IMPORTANCE_WEIGHT = { 1: 1, 2: 1.6, 3: 2.6 };
export const RESHOW_MIN = 5;
export const RESHOW_MAX = 10;
export const RESHOW_LIMIT = 2;
const LOOKAHEAD = 12;

export function mulberry32(seed) {
  let a = seed >>> 0;
  return function rng() {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Efraimidis–Spirakis: her kart bir kez yer alır, önemli kartlar başa daha sık düşer.
export function weightedShuffle(cards, rng = Math.random) {
  return cards
    .map((card) => ({ card, key: rng() ** (1 / (IMPORTANCE_WEIGHT[card.importance] ?? 1)) }))
    .sort((a, b) => b.key - a.key)
    .map((x) => x.card);
}

function violates(prev1, prev2, card) {
  if (!prev1) return false;
  if (prev1.course === card.course && prev1.topic === card.topic) return true;
  return Boolean(prev2) && prev1.type === card.type && prev2.type === card.type;
}

// Yumuşak kural: uygun aday ileride (12 kart içinde) varsa öne alınır, yoksa sıra korunur.
export function spreadOut(list, history = []) {
  const out = history.slice(-2);
  const skip = out.length;
  const rest = [...list];
  while (rest.length) {
    const p1 = out[out.length - 1];
    const p2 = out[out.length - 2];
    let pick = 0;
    if (violates(p1, p2, rest[0])) {
      const j = rest.slice(0, LOOKAHEAD).findIndex((c) => !violates(p1, p2, c));
      if (j > 0) pick = j;
    }
    out.push(rest.splice(pick, 1)[0]);
  }
  return out.slice(skip);
}

export class Feed {
  #rng;
  #byId;
  #shown; // bu turda ekranda gösterilen kartlar; önden yüklenip görülmeyenler sayılmaz
  #servedIds = new Set(); // bu turda sunulan (ekrana gelmiş ya da önden yüklenmiş) kartlar
  #carry; // önceki turdan gösterilmeden kalan kartlar; sonraki oturumda ilk sırada gelir
  #queue;
  #pending = [];
  #reshown = new Map();
  #history = [];
  #served = 0;

  constructor(cards, { rng = Math.random, seen = [], carry = [], startWith = null } = {}) {
    this.cards = cards;
    this.#rng = rng;
    this.#byId = new Map(cards.map((c) => [c.id, c]));
    this.#shown = new Set(seen.filter((id) => this.#byId.has(id)));
    this.#carry = new Set(carry.filter((id) => this.#byId.has(id) && !this.#shown.has(id)));
    const rest = cards.filter((c) => !this.#shown.has(c.id) && !this.#carry.has(c.id));
    this.#queue = [...[...this.#carry].map((id) => this.#byId.get(id)), ...this.#order(rest)];
    if (startWith && this.#byId.has(startWith)) {
      this.#queue = [this.#byId.get(startWith), ...this.#queue.filter((c) => c.id !== startWith)];
    }
  }

  get size() { return this.cards.length; }
  get seenIds() { return [...this.#shown]; }
  get carryIds() { return [...this.#carry]; }

  // Görüntüleyici kart ekrana gelince çağırır. Kaydedilen "görülenler" listesi yalnızca bunlardan oluşur.
  markShown(id) {
    if (!this.#byId.has(id)) return;
    this.#shown.add(id);
    this.#carry.delete(id);
  }

  #order(list) {
    return spreadOut(weightedShuffle(list, this.#rng), this.#history);
  }

  // Önden yükleme yüzünden tur, son kartlar ekrana gelmeden biter. Gösterilmeden kalanlar devreder:
  // yeni turun sırasına girmez (zaten ekranın hemen altındadır), oturum kapanırsa sonraki oturumda ilk gelir.
  #newCycle() {
    this.#carry = new Set([...this.#servedIds].filter((id) => !this.#shown.has(id)));
    this.#shown.clear();
    this.#servedIds.clear();
    const fresh = this.cards.filter((c) => !this.#carry.has(c.id));
    const queue = this.#order(fresh.length ? fresh : this.cards);
    const last = this.#history[this.#history.length - 1];
    if (queue.length > 1 && last && queue[0].id === last.id) [queue[0], queue[1]] = [queue[1], queue[0]];
    this.#queue = queue;
  }

  next() {
    if (!this.cards.length) return null;
    let card;
    let isReshow = false;
    const due = this.#pending.findIndex((p) => p.due <= this.#served);
    if (due >= 0) {
      card = this.#byId.get(this.#pending.splice(due, 1)[0].id);
      isReshow = true;
    } else {
      if (!this.#queue.length) this.#newCycle();
      card = this.#queue.shift();
      this.#servedIds.add(card.id);
    }
    this.#served += 1;
    this.#history.push(card);
    if (this.#history.length > 2) this.#history.shift();
    const variant = card.type === 'term' ? (this.#rng() < 0.5 ? 'quiz' : 'open') : null;
    return { card, key: `k${this.#served}`, isReshow, variant };
  }

  // `ahead`: ekrandaki karttan sonra önden yüklenmiş kart sayısı; tekrar, yanlış kartın 5-10 sonrasına düşer.
  reportWrong(id, ahead = 0) {
    if (!this.#byId.has(id)) return false;
    const times = this.#reshown.get(id) ?? 0;
    if (times >= RESHOW_LIMIT) return false;
    if (this.#pending.some((p) => p.id === id)) return false;
    this.#reshown.set(id, times + 1);
    const gap = RESHOW_MIN + Math.floor(this.#rng() * (RESHOW_MAX - RESHOW_MIN + 1));
    this.#pending.push({ id, due: this.#served - ahead + gap - 1 });
    return true;
  }
}
