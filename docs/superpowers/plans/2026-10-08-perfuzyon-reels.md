# Dünyanın en güzel perfüzyonisti — Uygulama Planı

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Perfüzyon 2. sınıf öğrencisi için, 6 dersten yaklaşık 2.000 doğrulanmış kartı Reels gibi kaydırılan, pembe ve şirin bir akışta gösteren, Gofrikli latte barıyla ödüllendiren telefon öncelikli statik bir site.

**Architecture:** Saf HTML/CSS/ES modülleri; derleme aracı yok. Kartlar `content/<DERS>/*.json` konu dosyalarında yazılır, `scripts/build-data.mjs` bunları doğrulayıp kalıcı kimlik ekleyerek `site/data/<DERS>.json` dosyalarına derler. Tarayıcıda saf mantık modülleri (akış sırası, latte ilerlemesi, saklama, kart durumu) DOM'a dokunan modüllerden (çizim, görüntüleyici, arayüz) ayrıdır; saf modüller Node'un yerleşik test koşucusuyla test edilir, arayüz uygulama içi tarayıcıda doğrulanır.

**Tech Stack:** HTML5, CSS (scroll-snap, custom properties, `<dialog>`), vanilla JS ES modülleri, Node 24 (`node:test`, `node:fs`), Google Fonts (Baloo 2 + Nunito). Harici JS kütüphanesi yok.

**Spec:** `docs/superpowers/specs/2026-10-08-perfuzyon-reels-design.md`

**Kod bloklarıyla ilgili not:** Tam dosya içeren her kod bloğunun ilk satırı `@file <yol>` işaretidir (`// @file …`, `/* @file … */` veya `<!-- @file … -->`). Bu satır dosyaya yazılmaz; bloğun geri kalanı dosyanın tam içeriğidir.

## Global Constraints

- Arayüz ve içerik dili Türkçe; site adı ve `<title>`: "Dünyanın en güzel perfüzyonisti".
- Dersler (kod · ad): PER141 Perfüzyon Teknikleri Teknolojisi I · PER207 Ekstrakorporeal Yaşam Desteği · PER241 Konjenital ve Pediatrik Hastalarda Perfüzyon I · PER243 Kardiyak Anestezi I · PER245 Yetişkin Perfüzyon I · PER247 Sterilizasyon ve Cerrahi Asepsi.
- Kart türleri ve etiketleri: `term` "📖 Terim", `fact` "💊 Hap bilgi", `flip` "🤔 Soru", `mcq` "✅ Test", `tf` "⚖️ Doğru mu, yanlış mı?", `remember` "⚠️ Bunu unutma!", `compare` "🔀 Karıştırma!".
- Hedef dağılım: terim %40, hap bilgi %18, test %15, soru %10, doğru/yanlış %8, bunu unutma %5, karıştırma %4; ders başına ~350 kart, en az 300.
- Her kartta ders kodu, ders adı ve konu görünür; önem derecesi 1-3 (3 = sınavda çok çıkar / hayati).
- Uzunluk: gövde ≤ 320 karakter, açıklama ≤ 240, test şıkkı ≤ 90.
- Terim kartlarının yarısı açık, yarısı "Bu terim ne demek?" (dokununca açılır) olarak gösterilir.
- Tamamlanma: açık bilgi kartları ekranda 2 sn kalınca; soru/gizli terim cevap açılınca; test ve doğru/yanlış seçim yapılınca. Akıştaki bir kart yalnızca bir kez sayılır.
- Latte barı: 50 kartta "Gofrikli latteyi kazandın! ☕" kutlaması, latte sayısı +1, bar sıfırlanır.
- Sıralama: önem ağırlıklı rastgele; bir turda her kart bir kez; aynı türden en fazla 2 kart art arda; aynı konudan art arda kart gelmemesine çalışılır; yanlış cevaplanan test/DY 5-10 kart sonra en fazla 2 kez yeniden gelir.
- DOM'da aynı anda en fazla ~30 dolu kart.
- Saklama: localStorage, her erişim try/catch içinde; depolama yoksa uygulama yine çalışır.
- Görünüm: pastel pembe/lila/krem; açık tema pastel pembe, koyu tema yıldızlı gece; unicorn, yıldız, kalp, parıltı süsleri gömülü SVG; "hareketi azalt" ayarına uyulur; Türkçe karakter destekli yuvarlak yazı tipi.
- Harici kaynak yalnızca Google Fonts; framework ve kütüphane yok.
- Telefon öncelikli: 375×812 ve 320×568'de yatay kaydırma yok, en az 16 px kenar boşluğu.
- İçerik doğruluğu: kartlara yalnızca `research/<DERS>.md` içinde kaynağı olan bilgi girer; ayrı doğrulama turu; emin olunamayan kart silinir.
- Git: Bu klasör git deposu değil; kullanıcı istemedikçe commit atılmaz. "Kontrol noktası" adımları testlerin geçtiğini doğrulamaktır.

## Review Focus

1. **iOS Safari'de görünür yükseklik değişirken (adres çubuğu açılıp kapanırken) kartın yarım kalması.** Her kaydırma tam bir karta oturmalı. → Task 5 Adım 6: 375×812 ve 320×568'de her slaytın akış yüksekliğine eşit olduğu ve kaydırma konumunun slayt sınırına oturduğu, pencere yeniden boyutlandırıldıktan sonra da, JS ile denetlenir.
2. **En uzun kartın küçük ekranda taşması** (uzun Türkçe birleşik kelimeler, uzun test açıklaması). Yatay kaydırma olmamalı, metin kırılmalı, gerekirse kart kendi içinde kaymalı. → Task 4 Adım 9: galeri sayfasında her türün en uzun kartı 320 px'te `scrollWidth <= clientWidth` ile denetlenir.
3. **localStorage yok, bozuk ya da kota dolu.** Uygulama açılmalı, ilerleme sıfırdan başlamalı, hata çıkmamalı. → Task 2: hata fırlatan depolama ve bozuk JSON testleri, `createProgress` temizleme testleri.
4. **Hızlı kaydırma (2 sn dolmadan geçme) ve geri kaydırıp tekrar bakma.** Bar artmamalı, aynı kart iki kez sayılmamalı, 50'de tek kutlama çıkmalı. → Task 3: `markCompleted` tekillik testi; Task 5 Adım 7: tarayıcıda hızlı kaydırma senaryosu.
5. **Bir dersin veri dosyası eksik ya da bozuk.** Diğer dersler çalışmalı, filtrede o ders "yüklenemedi" görünmeli; hepsi bozuksa "Tekrar dene" ekranı çıkmalı. → Task 4: `loadAllCards` testleri; Task 5 Adım 8: tarayıcıda bir dosya adı bozularak denetlenir.

---

## Dosya Haritası

| Dosya | Sorumluluk |
|---|---|
| `package.json` | ESM modu ve komutlar (`npm test`, `npm run build:data`, `npm run serve`) |
| `scripts/lib/cards.mjs` | Kart şeması: doğrulama, metin normalleştirme, kalıcı kimlik |
| `scripts/build-data.mjs` | `content/` → `site/data/` derleme, hata ve dağılım raporu |
| `scripts/serve.mjs` | Önizleme için bağımlılıksız statik sunucu |
| `scripts/build-artifact.mjs` | `site/index.html`'den Artifact sürümünü üretir |
| `tests/fixtures/content/…` | Geliştirme ve test için örnek kartlar |
| `tests/*.test.mjs` | `node:test` testleri |
| `site/index.html` | Uygulama kabuğu ve SVG sprite (unicorn, yıldız, kalp, latte) |
| `site/css/styles.css` | Tasarım tokenları (açık/koyu), düzen, kart türleri, sayfalar, animasyonlar |
| `site/js/data.js` | Ders listesi ve kart dosyalarının yüklenmesi |
| `site/js/store.js` | Güvenli localStorage sarmalayıcı |
| `site/js/progress.js` | Latte ilerlemesi ve istatistikler (saf) |
| `site/js/feed.js` | Akış sırası: ağırlıklı karıştırma, yayma, turlar, yanlışları tekrar (saf) |
| `site/js/cardstate.js` | Tek bir kart gösteriminin etkileşim durumu (saf) |
| `site/js/text.js` | `**kalın**` işaretini ayrıştırma (saf) |
| `site/js/render.js` | Kart türü → DOM |
| `site/js/viewer.js` | Kaydırmalı akış: snap, görünürlük, ekleme, boşaltma, 2 sn sayacı |
| `site/js/ui.js` | Üst bar, latte barı, filtre ve menü sayfaları, kutlama, bildirimler |
| `site/js/main.js` | Her şeyi bağlayan giriş noktası |
| `site/gallery.html`, `site/js/gallery.js` | Geliştirme için tüm kart türlerinin vitrini |
| `docs/content-guide.md` | Kart yazım ve doğrulama rehberi |
| `content/<DERS>/NN-konu.json` | Konu başına kart kaynak dosyaları |
| `research/<DERS>.md` | Web araştırma dosyaları (Task 0, arka planda sürüyor) |

Not: Spec §7'deki `scripts/validate.mjs` görevini `scripts/lib/cards.mjs` (doğrulama) ve `scripts/build-data.mjs` (komut satırı) birlikte üstlenir.

**Task 0 (devam ediyor):** 6 ders için araştırma ajanları `research/<DERS>.md` dosyalarını yazıyor. Task 6-8 bunlara bağlıdır; Task 1-5 bağımsızdır.

---

### Task 1: Kart şeması, doğrulayıcı ve veri derleme

**Files:**
- Create: `package.json`, `scripts/lib/cards.mjs`, `scripts/build-data.mjs`
- Create: `tests/fixtures/content/PER245/01-ornek.json`, `tests/fixtures/content/PER207/01-ornek.json`
- Test: `tests/cards.test.mjs`, `tests/build-data.test.mjs`

**Interfaces:**
- Produces: `COURSE_CODES: string[]`, `TYPES: string[]`, `TARGET_SHARE: Record<type, number>`, `LIMITS`, `normalizeText(s): string`, `validateCard(card): string[]`, `cardId(course, card): string` (`PER245-xxxxxxx`), `fnv1a(str): number` — `scripts/lib/cards.mjs`
- Produces: `buildCourse(srcRoot, course) → {missing, cards, errors}`, `computeStats(cards)`, `distributionWarnings(stats, minTotal=300): string[]`, `main(args): Promise<0|1>` — `scripts/build-data.mjs`
- Çıktı biçimi: `site/data/<DERS>.json` = kart dizisi; her kart `{id, course, topic, type, importance, ...türe özgü alanlar, source?}`.
- Kaynak biçimi: `content/<DERS>/NN-slug.json` = `{"topic": "…", "cards": [ {type, importance, …} ]}`; kart kendi `topic` alanıyla dosyanın konusunu ezebilir; `_` ile başlayan dosyalar atlanır.

- [ ] **Step 1: package.json oluştur**

```json
// @file package.json
{
  "name": "dunyanin-en-guzel-perfuzyonisti",
  "private": true,
  "type": "module",
  "scripts": {
    "test": "node --test",
    "build:data": "node scripts/build-data.mjs",
    "build:fixtures": "node scripts/build-data.mjs --src tests/fixtures/content",
    "serve": "node scripts/serve.mjs site"
  }
}
```

- [ ] **Step 2: Şema testlerini yaz**

```js
// @file tests/cards.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validateCard, cardId, fnv1a, normalizeText } from '../scripts/lib/cards.mjs';

const valid = {
  term: { type: 'term', importance: 3, topic: 'Kardiyopleji', term: 'Kardiyopleji', en: 'Cardioplegia', definition: 'Kalbi diyastolde durduran solüsyon.', origin: 'kardia = kalp' },
  fact: { type: 'fact', importance: 2, topic: 'ACT', title: 'ACT nedir?', body: '**ACT** yatak başı pıhtılaşma testidir.' },
  remember: { type: 'remember', importance: 3, topic: 'ACT', title: 'Hedef', body: 'KPB öncesi ACT kontrol edilir.' },
  flip: { type: 'flip', importance: 2, topic: 'Protamin', question: 'Protamin ne işe yarar?', answer: 'Heparini nötralize eder.' },
  mcq: { type: 'mcq', importance: 2, topic: 'Oksijenatör', question: 'CO2 atılımını ne belirler?', options: ['Sweep gaz akımı', 'FiO2', 'Pompa devri', 'Rezervuar seviyesi'], correct: 0, explanation: 'Sweep gaz akımı.' },
  tf: { type: 'tf', importance: 1, topic: 'Pompalar', statement: 'Santrifügal pompa ard yüke duyarlıdır.', isTrue: true, explanation: 'Direnç artınca akım düşer.' },
  compare: { type: 'compare', importance: 2, topic: 'Pompalar', title: 'Roller ve santrifügal', left: { title: 'Roller', points: ['Oklüzif', 'Akım devre bağlı'] }, right: { title: 'Santrifügal', points: ['Oklüzif değil', 'Akım ölçer gerekir'] } },
};

test('her türün geçerli örneği hatasız geçer', () => {
  for (const [type, card] of Object.entries(valid)) assert.deepEqual(validateCard(card), [], type);
});

test('bilinmeyen tür ve geçersiz önem reddedilir', () => {
  assert.match(validateCard({ ...valid.fact, type: 'quiz' })[0], /bilinmeyen tür/);
  assert.ok(validateCard({ ...valid.fact, importance: 5 }).some((e) => e.includes('importance')));
});

test('uzunluk sınırları uygulanır', () => {
  const errs = validateCard({ ...valid.term, definition: 'a'.repeat(321) });
  assert.ok(errs.some((e) => e.includes('definition') && e.includes('321/320')));
});

test('test kartı kuralları', () => {
  assert.ok(validateCard({ ...valid.mcq, options: ['a', 'b', 'c'] }).some((e) => e.includes('4 şık')));
  assert.ok(validateCard({ ...valid.mcq, correct: 4 }).some((e) => e.includes('correct')));
  assert.ok(validateCard({ ...valid.mcq, options: ['x', 'X', 'y', 'z'] }).some((e) => e.includes('aynı şık')));
  assert.ok(validateCard({ ...valid.mcq, options: ['Hepsi', 'b', 'c', 'd'] }).some((e) => e.includes('karıştırılınca')));
  assert.ok(validateCard({ ...valid.mcq, options: ['A ve B', 'b', 'c', 'd'] }).some((e) => e.includes('karıştırılınca')));
});

test('doğru/yanlış ve karşılaştırma kuralları', () => {
  assert.ok(validateCard({ ...valid.tf, isTrue: 'true' }).some((e) => e.includes('isTrue')));
  assert.ok(validateCard({ ...valid.compare, left: { title: 'Roller', points: ['tek'] } }).some((e) => e.includes('left.points')));
});

test('tanınmayan alan ve eşleşmeyen ** reddedilir', () => {
  assert.ok(validateCard({ ...valid.fact, extra: 1 }).some((e) => e.includes('tanınmayan alan')));
  assert.ok(validateCard({ ...valid.fact, body: '**ACT yatak başı' }).some((e) => e.includes('**')));
});

test('isteğe bağlı kaynak alanı kabul edilir ama boş olamaz', () => {
  assert.deepEqual(validateCard({ ...valid.fact, source: 'EACTS 2024' }), []);
  assert.ok(validateCard({ ...valid.fact, source: ' ' }).some((e) => e.includes('source')));
});

test('fnv1a bilinen değerleri üretir', () => {
  assert.equal(fnv1a(''), 0x811c9dc5);
  assert.equal(fnv1a('a'), 0xe40c292c);
});

test('cardId büyük/küçük harf ve boşluk farkını yok sayar, Türkçe İ/i doğru', () => {
  const a = cardId('PER245', { ...valid.term, term: 'İnotrop' });
  const b = cardId('PER245', { ...valid.term, term: '  inotrop ' });
  assert.equal(a, b);
  assert.match(a, /^PER245-[0-9a-z]{7}$/);
  assert.notEqual(a, cardId('PER245', { ...valid.term, term: 'Kronotrop' }));
  assert.notEqual(a, cardId('PER243', { ...valid.term, term: 'İnotrop' }));
});

test('normalizeText Türkçe küçük harfe çevirir', () => {
  assert.equal(normalizeText('  IŞIK  Ağır '), 'ışık ağır');
});
```

- [ ] **Step 3: Testi çalıştır, başarısız olduğunu gör**

Run: `npm test`
Expected: FAIL — `Cannot find module '…/scripts/lib/cards.mjs'`

- [ ] **Step 4: Şemayı yaz**

```js
// @file scripts/lib/cards.mjs
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
```

- [ ] **Step 5: Testi çalıştır, geçtiğini gör**

Run: `npm test`
Expected: PASS — `tests/cards.test.mjs` içindeki 10 test geçer.

- [ ] **Step 6: Derleme testlerini yaz**

```js
// @file tests/build-data.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { buildCourse, computeStats, distributionWarnings, main } from '../scripts/build-data.mjs';

const fact = (title, extra = {}) => ({ type: 'fact', importance: 2, title, body: `${title} açıklaması.`, ...extra });

async function makeSrc(files) {
  const root = await mkdtemp(path.join(tmpdir(), 'dep-'));
  for (const [rel, content] of Object.entries(files)) {
    const p = path.join(root, rel);
    await mkdir(path.dirname(p), { recursive: true });
    await writeFile(p, typeof content === 'string' ? content : JSON.stringify(content));
  }
  return root;
}

test('geçerli kartlara kimlik, ders ve konu eklenir', async () => {
  const src = await makeSrc({ 'PER245/01-a.json': { topic: 'Kanülasyon', cards: [fact('Bir'), fact('İki', { topic: 'Özel konu' })] } });
  const { cards, errors, missing } = await buildCourse(src, 'PER245');
  assert.equal(missing, false);
  assert.deepEqual(errors, []);
  assert.equal(cards.length, 2);
  assert.match(cards[0].id, /^PER245-/);
  assert.equal(cards[0].course, 'PER245');
  assert.equal(cards[0].topic, 'Kanülasyon');
  assert.equal(cards[1].topic, 'Özel konu');
});

test('hatalı kart, bozuk dosya ve tekrar eden kart dosya ve sıra numarasıyla raporlanır', async () => {
  const src = await makeSrc({
    'PER245/01-a.json': { topic: 'A', cards: [fact('Bir'), { type: 'fact', importance: 2 }] },
    'PER245/02-b.json': '{ bozuk',
    'PER245/03-c.json': { topic: 'A', cards: [fact('Bir')] },
    'PER245/_notlar.json': '{ bu dosya atlanır',
  });
  const { cards, errors } = await buildCourse(src, 'PER245');
  assert.equal(cards.length, 1);
  assert.ok(errors.some((e) => e.startsWith('PER245/01-a.json #2:')));
  assert.ok(errors.some((e) => e.startsWith('PER245/02-b.json: JSON okunamadı')));
  assert.ok(errors.some((e) => e.includes('03-c.json #1: tekrarlanan kart')));
  assert.ok(!errors.some((e) => e.includes('_notlar')));
});

test('karttaki id/course alanı hesaplanan kimliği ezmez', async () => {
  const src = await makeSrc({ 'PER245/01.json': { topic: 'A', cards: [fact('Bir', { id: 'x', course: 'PER141' })] } });
  const { cards } = await buildCourse(src, 'PER245');
  assert.match(cards[0].id, /^PER245-[0-9a-z]{7}$/);
  assert.equal(cards[0].course, 'PER245');
});

test('klasör yoksa missing döner', async () => {
  const src = await makeSrc({});
  assert.equal((await buildCourse(src, 'PER141')).missing, true);
});

test('dağılım uyarıları hedeften sapmayı ve az kartı bildirir', () => {
  const stats = computeStats(Array.from({ length: 10 }, (_, i) => ({ type: 'fact', importance: 1, topic: `T${i % 3}` })));
  const warnings = distributionWarnings(stats);
  assert.ok(warnings.some((w) => w.startsWith('toplam 10 kart')));
  assert.ok(warnings.some((w) => w.startsWith('term: %0')));
  assert.equal(stats.topics.length, 3);
});

test('main çıktı dosyası yazar ve hata varsa 1 döner', async () => {
  const src = await makeSrc({ 'PER245/01.json': { topic: 'A', cards: [fact('Bir')] }, 'PER247/01.json': { topic: 'A', cards: [{ type: 'x' }] } });
  const out = path.join(src, 'out');
  const code = await main(['PER245', 'PER247', '--src', src, '--out', out]);
  assert.equal(code, 1);
  const written = JSON.parse(await readFile(path.join(out, 'PER245.json'), 'utf8'));
  assert.equal(written.length, 1);
});
```

- [ ] **Step 7: Testi çalıştır, başarısız olduğunu gör**

Run: `npm test`
Expected: FAIL — `Cannot find module '…/scripts/build-data.mjs'`

- [ ] **Step 8: Derleme betiğini yaz**

```js
// @file scripts/build-data.mjs
// İçerik klasöründeki konu dosyalarını doğrular, kimlik ekler ve site/data/<DERS>.json olarak yazar.
// Kullanım: node scripts/build-data.mjs [PER245 …] [--src content] [--out site/data]
import { mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { COURSE_CODES, TARGET_SHARE, TYPES, cardId, validateCard } from './lib/cards.mjs';

export async function buildCourse(srcRoot, course) {
  const dir = path.join(srcRoot, course);
  let files;
  try {
    files = (await readdir(dir)).filter((f) => f.endsWith('.json') && !f.startsWith('_')).sort();
  } catch {
    return { missing: true, cards: [], errors: [] };
  }
  const cards = [];
  const errors = [];
  const seen = new Map();
  for (const file of files) {
    let doc;
    try {
      doc = JSON.parse(await readFile(path.join(dir, file), 'utf8'));
    } catch (err) {
      errors.push(`${course}/${file}: JSON okunamadı (${err.message})`);
      continue;
    }
    if (!doc || typeof doc.topic !== 'string' || !Array.isArray(doc.cards)) {
      errors.push(`${course}/${file}: dosya {"topic": "...", "cards": [...]} biçiminde olmalı`);
      continue;
    }
    doc.cards.forEach((raw, i) => {
      const where = `${course}/${file} #${i + 1}`;
      const card = { topic: doc.topic, ...raw };
      const problems = validateCard(card);
      if (problems.length) {
        errors.push(...problems.map((p) => `${where}: ${p}`));
        return;
      }
      const id = cardId(course, card);
      if (seen.has(id)) {
        errors.push(`${where}: tekrarlanan kart (${seen.get(id)} ile aynı)`);
        return;
      }
      seen.set(id, where);
      const { type, importance, topic, id: _ignoredId, course: _ignoredCourse, ...rest } = card;
      cards.push({ id, course, topic, type, importance, ...rest });
    });
  }
  return { missing: false, cards, errors };
}

export function computeStats(cards) {
  const byType = Object.fromEntries(TYPES.map((t) => [t, 0]));
  const byImportance = { 1: 0, 2: 0, 3: 0 };
  const topics = new Map();
  for (const c of cards) {
    byType[c.type] += 1;
    byImportance[c.importance] += 1;
    topics.set(c.topic, (topics.get(c.topic) ?? 0) + 1);
  }
  return { total: cards.length, byType, byImportance, topics: [...topics].map(([name, count]) => ({ name, count })) };
}

export function distributionWarnings(stats, minTotal = 300) {
  const warnings = [];
  if (stats.total < minTotal) warnings.push(`toplam ${stats.total} kart (en az ${minTotal} olmalı)`);
  if (!stats.total) return warnings;
  for (const t of TYPES) {
    const share = stats.byType[t] / stats.total;
    if (Math.abs(share - TARGET_SHARE[t]) > 0.05) {
      warnings.push(`${t}: %${Math.round(share * 100)} (hedef %${Math.round(TARGET_SHARE[t] * 100)})`);
    }
  }
  return warnings;
}

function formatStats(s) {
  const types = TYPES.map((t) => `${t}:${s.byType[t]}`).join(' ');
  return `${types} | önem 3:${s.byImportance[3]} 2:${s.byImportance[2]} 1:${s.byImportance[1]} | ${s.topics.length} konu`;
}

function argValue(args, name, fallback) {
  const i = args.indexOf(name);
  return i >= 0 && args[i + 1] ? args[i + 1] : fallback;
}

export async function main(args = process.argv.slice(2)) {
  const src = argValue(args, '--src', 'content');
  const out = argValue(args, '--out', 'site/data');
  const picked = args.filter((a) => COURSE_CODES.includes(a));
  const courses = picked.length ? picked : COURSE_CODES;
  await mkdir(out, { recursive: true });
  let failed = false;
  for (const course of courses) {
    const target = path.join(out, `${course}.json`);
    const { missing, cards, errors } = await buildCourse(src, course);
    if (missing) {
      await rm(target, { force: true });
      console.warn(`- ${course}: içerik klasörü yok, atlandı`);
      continue;
    }
    if (errors.length) {
      failed = true;
      console.error(`✗ ${course}: ${errors.length} hata`);
      for (const e of errors) console.error(`  ${e}`);
      continue;
    }
    await writeFile(target, JSON.stringify(cards));
    const stats = computeStats(cards);
    console.log(`✓ ${course}: ${stats.total} kart  ${formatStats(stats)}`);
    for (const w of distributionWarnings(stats)) console.warn(`  ! ${w}`);
  }
  return failed ? 1 : 0;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  process.exitCode = await main();
}
```

- [ ] **Step 9: Geliştirme için örnek kart dosyalarını yaz**

```json
// @file tests/fixtures/content/PER245/01-ornek.json
{
  "topic": "Örnek kartlar",
  "cards": [
    { "type": "term", "importance": 3, "term": "Kardiyopleji", "en": "Cardioplegia", "definition": "Kalp cerrahisi sırasında kalbi **diyastolde durdurmak** ve miyokardı korumak için koroner dolaşıma verilen, genellikle potasyumdan zengin solüsyon.", "origin": "kardia = kalp, plegia = felç" },
    { "type": "term", "importance": 2, "term": "Hemodilüsyon", "en": "Hemodilution", "definition": "Kanın kristaloid veya kolloid sıvılarla seyreltilmesi. KPB'de prime solüsyonu kana karışınca hematokrit düşer.", "origin": "hemo = kan, dilüsyon = seyreltme" },
    { "type": "fact", "importance": 2, "title": "ACT nedir?", "body": "**ACT** (aktive pıhtılaşma zamanı), heparin etkisini ameliyathanede hızlıca izlemek için kullanılan yatak başı testidir." },
    { "type": "remember", "importance": 3, "title": "KPB'ye girmeden önce", "body": "Heparin verildikten sonra ACT mutlaka kontrol edilir. Yaygın kabul gören hedef **480 saniye ve üzeridir**." },
    { "type": "flip", "importance": 2, "question": "Protamin ne için kullanılır?", "answer": "Heparinin etkisini **nötralize etmek** için. KPB sonlandırıldıktan sonra yavaşça verilir." },
    { "type": "mcq", "importance": 2, "question": "Membran oksijenatörde CO2 atılımını en çok hangisi belirler?", "options": ["Sweep gaz akım hızı", "FiO2", "Pompa devri", "Venöz rezervuar seviyesi"], "correct": 0, "explanation": "CO2 atılımı esas olarak **sweep gaz akımıyla**, oksijenlenme ise **FiO2** ile ayarlanır." },
    { "type": "tf", "importance": 2, "statement": "Santrifügal pompada aynı devirde ard yük (direnç) artarsa akım azalır.", "isTrue": true, "explanation": "Santrifügal pompalar ön yük ve ard yüke duyarlıdır. Bu yüzden akım ölçer kullanmak şarttır." },
    { "type": "compare", "importance": 2, "title": "Pompa türleri", "left": { "title": "Roller pompa", "points": ["Oklüzif çalışır, tüpü sıkıştırarak kanı iter", "Akım; devir ve tüp çapıyla belirlenir"] }, "right": { "title": "Santrifügal pompa", "points": ["Oklüzif değildir, dönen çark ile çalışır", "Akım ön ve ard yüke bağlıdır, akım ölçer gerekir"] } }
  ]
}
```

```json
// @file tests/fixtures/content/PER207/01-ornek.json
{
  "topic": "Uzun örnekler",
  "cards": [
    { "type": "term", "importance": 3, "term": "Ekstrakorporeal membran oksijenasyonu", "en": "Extracorporeal membrane oxygenation (ECMO)", "definition": "Kanın vücut dışına alınıp bir pompa ve membran oksijenatör yardımıyla oksijenlendirilip karbondioksitten arındırıldıktan sonra hastaya geri verildiği, ağır kalp ve/veya akciğer yetmezliğinde günler-haftalar boyunca kullanılabilen mekanik yaşam desteği yöntemi.", "origin": "ekstra = dışında, korpus = beden" },
    { "type": "mcq", "importance": 3, "question": "Periferik venoarteriyel (VA) ECMO uygulanan ve kalbi kısmen ejeksiyon yapan bir hastada üst vücutta görülebilen hipoksemi tablosuna ne ad verilir?", "options": ["Diferansiyel hipoksi (Harlequin / kuzey-güney sendromu)", "Resirkülasyon", "Hava kilidi", "Kompartman sendromu"], "correct": 0, "explanation": "Femoral VA ECMO'da oksijenli kan aortaya geriye doğru verilir; kalpten atılan, akciğerde yeterince oksijenlenmemiş kan koroner ve beyin damarlarına gidebilir. Bu yüzden sağ radial arterden kan gazı izlenir." }
  ]
}
```

- [ ] **Step 10: Tüm testleri ve örnek derlemeyi çalıştır**

Run: `npm test && npm run build:fixtures`
Expected: tüm testler PASS; çıktı `✓ PER207: 2 kart …`, `✓ PER245: 8 kart …`, diğer dersler için `- PERxxx: içerik klasörü yok, atlandı`; `site/data/PER245.json` ve `site/data/PER207.json` oluşur.

- [ ] **Step 11: Kontrol noktası** — `npm test` yeşil; `site/data/` içinde yalnızca iki örnek dosya var.

---

### Task 2: Cihazda saklama ve latte ilerlemesi

**Files:**
- Create: `site/js/store.js`, `site/js/progress.js`
- Test: `tests/store.test.mjs`, `tests/progress.test.mjs`

**Interfaces:**
- Produces: `memoryBackend()`, `browserBackend()`, `createStore(backend?, prefix='dep:') → {get(key, fallback), set(key, value): boolean, remove(key)}` — `site/js/store.js`
- Produces: `GOAL = 50`, `todayKey(now): 'YYYY-MM-DD'`, `createProgress(saved, now?) → Progress`, `completeCard(state, now?) → {state, earnedLatte}`, `recordAnswer(state, isCorrect) → Progress` — `site/js/progress.js`
- `Progress = {filled, lattes, totalDone, correct, wrong, day, doneToday}` (hepsi negatif olmayan tam sayı, `day` yerel tarih).

- [ ] **Step 1: Testleri yaz**

```js
// @file tests/store.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { browserBackend, createStore, memoryBackend } from '../site/js/store.js';

const throwing = {
  getItem() { throw new Error('engelli'); },
  setItem() { throw new Error('kota doldu'); },
  removeItem() { throw new Error('engelli'); },
};

test('değer yazılır ve okunur, önek ayrımı yapılır', () => {
  const backend = memoryBackend();
  const a = createStore(backend, 'a:');
  const b = createStore(backend, 'b:');
  assert.equal(a.set('x', { n: 1 }), true);
  assert.deepEqual(a.get('x'), { n: 1 });
  assert.equal(b.get('x', 'yok'), 'yok');
});

test('bozuk JSON ve eksik anahtar varsayılanı döndürür', () => {
  const backend = memoryBackend();
  backend.setItem('dep:x', '{bozuk');
  const s = createStore(backend);
  assert.equal(s.get('x', 7), 7);
  assert.equal(s.get('yok', null), null);
});

test('hata fırlatan depolama uygulamayı durdurmaz', () => {
  const s = createStore(throwing);
  assert.equal(s.get('x', 'varsayılan'), 'varsayılan');
  assert.equal(s.set('x', 1), false);
  assert.doesNotThrow(() => s.remove('x'));
});

test('browserBackend her ortamda yazılıp okunabilen bir depo döndürür', () => {
  const b = browserBackend();
  b.setItem('k', 'v');
  assert.equal(b.getItem('k'), 'v');
});
```

```js
// @file tests/progress.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { GOAL, completeCard, createProgress, recordAnswer, todayKey } from '../site/js/progress.js';

const day1 = new Date(2026, 9, 8, 10, 0);
const day2 = new Date(2026, 9, 9, 9, 0);

test('boş ya da bozuk kayıttan temiz başlangıç', () => {
  for (const saved of [undefined, null, 'x', { filled: -3, lattes: 'çok', totalDone: 1.5, correct: NaN }]) {
    assert.deepEqual(createProgress(saved, day1), { filled: 0, lattes: 0, totalDone: 0, correct: 0, wrong: 0, day: '2026-10-08', doneToday: 0 });
  }
});

test('kayıtlı bar taşmış görünse bile 49’da kalır', () => {
  assert.equal(createProgress({ filled: 80 }, day1).filled, GOAL - 1);
});

test('her kart barı 1 doldurur; 50. kartta latte kazanılır ve bar sıfırlanır', () => {
  let p = createProgress(null, day1);
  let earned = 0;
  for (let i = 0; i < GOAL - 1; i++) {
    const r = completeCard(p, day1);
    p = r.state;
    if (r.earnedLatte) earned += 1;
  }
  assert.equal(p.filled, 49);
  assert.equal(earned, 0);
  const r = completeCard(p, day1);
  assert.equal(r.earnedLatte, true);
  assert.equal(r.state.filled, 0);
  assert.equal(r.state.lattes, 1);
  assert.equal(r.state.totalDone, 50);
  assert.equal(r.state.doneToday, 50);
});

test('gün değişince bugünkü sayaç sıfırdan başlar', () => {
  const p = completeCard(completeCard(createProgress(null, day1), day1).state, day1).state;
  assert.equal(p.doneToday, 2);
  const next = completeCard(p, day2).state;
  assert.equal(next.day, '2026-10-09');
  assert.equal(next.doneToday, 1);
  assert.equal(next.totalDone, 3);
  assert.equal(createProgress(p, day2).doneToday, 0);
});

test('doğru ve yanlış cevaplar sayılır', () => {
  let p = createProgress(null, day1);
  p = recordAnswer(recordAnswer(recordAnswer(p, true), false), true);
  assert.equal(p.correct, 2);
  assert.equal(p.wrong, 1);
});

test('todayKey yerel tarihi YYYY-MM-DD verir', () => {
  assert.equal(todayKey(new Date(2026, 0, 5)), '2026-01-05');
});
```

- [ ] **Step 2: Testleri çalıştır, başarısız olduğunu gör**

Run: `npm test`
Expected: FAIL — `Cannot find module '…/site/js/store.js'` ve `…/site/js/progress.js`

- [ ] **Step 3: Saklama ve ilerleme modüllerini yaz**

```js
// @file site/js/store.js
// Cihazda saklama. localStorage engelliyse (gizli sekme, kapalı site verisi) bellek içi yedek kullanılır;
// her okuma ve yazma try/catch içindedir, depolama hatası uygulamayı asla durdurmaz.
export function memoryBackend() {
  const map = new Map();
  return {
    getItem: (k) => (map.has(k) ? map.get(k) : null),
    setItem: (k, v) => { map.set(k, String(v)); },
    removeItem: (k) => { map.delete(k); },
  };
}

export function browserBackend() {
  try {
    const ls = globalThis.localStorage;
    ls.setItem('dep:__probe__', '1');
    ls.removeItem('dep:__probe__');
    return ls;
  } catch {
    return memoryBackend();
  }
}

export function createStore(backend = browserBackend(), prefix = 'dep:') {
  return {
    get(key, fallback = null) {
      try {
        const raw = backend.getItem(prefix + key);
        return raw == null ? fallback : JSON.parse(raw);
      } catch {
        return fallback;
      }
    },
    set(key, value) {
      try {
        backend.setItem(prefix + key, JSON.stringify(value));
        return true;
      } catch {
        return false;
      }
    },
    remove(key) {
      try {
        backend.removeItem(prefix + key);
      } catch {
        // Silinemiyorsa yapacak bir şey yok.
      }
    },
  };
}
```

```js
// @file site/js/progress.js
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
```

- [ ] **Step 4: Testleri çalıştır, geçtiğini gör**

Run: `npm test`
Expected: PASS — store (4) ve progress (6) testleri dahil hepsi geçer.

- [ ] **Step 5: Kontrol noktası** — `npm test` yeşil.

---

### Task 3: Akış sırası, kart durumu ve kalın yazı

**Files:**
- Create: `site/js/feed.js`, `site/js/cardstate.js`, `site/js/text.js`
- Test: `tests/feed.test.mjs`, `tests/cardstate.test.mjs`, `tests/text.test.mjs`

**Interfaces:**
- Produces (`feed.js`): `IMPORTANCE_WEIGHT`, `RESHOW_MIN=5`, `RESHOW_MAX=10`, `RESHOW_LIMIT=2`, `mulberry32(seed) → () => number`, `weightedShuffle(cards, rng) → Card[]`, `spreadOut(list, history=[]) → Card[]`, `class Feed(cards, {rng, seen, startWith})` with `next() → {card, key, isReshow, variant} | null`, `reportWrong(id, ahead=0) → boolean`, `seenIds: string[]`, `size: number`. `variant` terim kartlarında `'open' | 'quiz'`, diğerlerinde `null`. `ahead`: kullanıcının baktığı karttan sonra önden yüklenmiş kart sayısı.
- Produces (`cardstate.js`): `createRecord(item, rng) → Record` (`{card, key, isReshow, variant, revealed, chosen, optionOrder, completed}`), `shuffledIndices(n, rng)`, `chooseOption(record, displayIndex) → {isCorrect} | null`, `chooseTrueFalse(record, answer) → {isCorrect} | null`, `reveal(record) → boolean`, `completesByDwell(record) → boolean`, `markCompleted(record) → boolean`.
- Produces (`text.js`): `tokenizeBold(text) → {text, bold}[]`.

- [ ] **Step 1: Testleri yaz**

```js
// @file tests/feed.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Feed, RESHOW_LIMIT, mulberry32, spreadOut, weightedShuffle } from '../site/js/feed.js';

const KINDS = ['term', 'fact', 'mcq', 'flip', 'tf'];
function makeCards(n, { importance = () => 2, topics = 7 } = {}) {
  return Array.from({ length: n }, (_, i) => ({ id: `c${i}`, course: 'PER245', topic: `T${i % topics}`, type: KINDS[i % KINDS.length], importance: importance(i) }));
}
const take = (feed, n) => Array.from({ length: n }, () => feed.next());

test('bir turda her kart tam bir kez gelir, sonra yeni tur başlar', () => {
  const feed = new Feed(makeCards(40), { rng: mulberry32(1) });
  const first = take(feed, 40).map((x) => x.card.id);
  assert.equal(new Set(first).size, 40);
  const second = take(feed, 40).map((x) => x.card.id);
  assert.equal(new Set(second).size, 40);
  assert.notEqual(second[0], first[39]);
});

test('kaydedilmiş görülenler bu turda tekrar gelmez; bilinmeyen kimlikler yok sayılır', () => {
  const feed = new Feed(makeCards(10), { rng: mulberry32(2), seen: ['c0', 'c1', 'c2', 'silinmis-kart'] });
  const ids = take(feed, 7).map((x) => x.card.id);
  assert.equal(new Set(ids).size, 7);
  assert.ok(!ids.some((id) => ['c0', 'c1', 'c2'].includes(id)));
  assert.equal(feed.seenIds.length, 10);
});

test('startWith ile kalınan kart ilk gelir', () => {
  const feed = new Feed(makeCards(10), { rng: mulberry32(3), startWith: 'c7' });
  assert.equal(feed.next().card.id, 'c7');
});

test('yanlış cevaplanan kart tam aralıkla yeniden gelir, en fazla 2 kez', () => {
  const feed = new Feed(makeCards(60), { rng: () => 0 }); // aralık = RESHOW_MIN = 5
  const first = feed.next();
  assert.equal(feed.reportWrong(first.card.id, 0), true);
  assert.equal(feed.reportWrong(first.card.id, 0), false, 'beklerken ikinci kez eklenmez');
  const next5 = take(feed, 5);
  assert.equal(next5[4].card.id, first.card.id);
  assert.equal(next5[4].isReshow, true);
  assert.equal(feed.reportWrong(first.card.id, 0), true);
  take(feed, 5);
  assert.equal(feed.reportWrong(first.card.id, 0), false, `en fazla ${RESHOW_LIMIT} kez`);
});

test('önden yüklenen kartlar hesaba katılır (ahead)', () => {
  const feed = new Feed(makeCards(60), { rng: () => 0 });
  const items = take(feed, 4); // kullanıcı 1. kartta, 3 kart önden yüklü
  feed.reportWrong(items[0].card.id, 3);
  const more = take(feed, 2);
  assert.equal(more[1].card.id, items[0].card.id); // 1 + 5 = 6. sırada
});

test('önemli kartlar sıranın başına daha sık düşer', () => {
  const cards = makeCards(100, { importance: (i) => (i < 50 ? 3 : 1) });
  const rng = mulberry32(42);
  let hi = 0;
  let lo = 0;
  for (let r = 0; r < 200; r++) {
    weightedShuffle(cards, rng).forEach((c, pos) => {
      if (c.importance === 3) hi += pos;
      else lo += pos;
    });
  }
  assert.ok(hi < lo * 0.8, `önemli toplam sıra ${hi}, önemsiz ${lo}`);
});

test('spreadOut aynı konuyu art arda ve aynı türü 3 kez art arda dizmez', () => {
  const list = [
    { id: 'a', topic: 'X', type: 'term' }, { id: 'b', topic: 'X', type: 'term' }, { id: 'c', topic: 'Y', type: 'term' },
    { id: 'd', topic: 'Z', type: 'term' }, { id: 'e', topic: 'W', type: 'fact' }, { id: 'f', topic: 'V', type: 'mcq' },
  ].map((c) => ({ course: 'PER245', importance: 2, ...c }));
  const out = spreadOut(list);
  assert.equal(out.length, list.length);
  for (let i = 1; i < out.length; i++) assert.notEqual(out[i].topic, out[i - 1].topic);
  for (let i = 2; i < out.length; i++) assert.ok(!(out[i].type === out[i - 1].type && out[i].type === out[i - 2].type));
});

test('boş akış null döner, tek kartlı akış takılmaz', () => {
  assert.equal(new Feed([]).next(), null);
  const one = new Feed(makeCards(1));
  assert.ok(take(one, 3).every((x) => x.card.id === 'c0'));
});

test('yalnızca terim kartlarına açık/gizli gösterim seçilir', () => {
  const feed = new Feed(makeCards(20), { rng: mulberry32(9) });
  for (const x of take(feed, 20)) {
    if (x.card.type === 'term') assert.ok(['open', 'quiz'].includes(x.variant));
    else assert.equal(x.variant, null);
  }
});
```

```js
// @file tests/cardstate.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { chooseOption, chooseTrueFalse, completesByDwell, createRecord, markCompleted, reveal, shuffledIndices } from '../site/js/cardstate.js';
import { mulberry32 } from '../site/js/feed.js';

const mcq = { id: 'm', type: 'mcq', options: ['a', 'b', 'c', 'd'], correct: 2 };
const item = (card, variant = null) => ({ card, key: 'k1', isReshow: false, variant });

test('şık sırası karıştırılır ama doğru cevap izlenir', () => {
  const rec = createRecord(item(mcq), mulberry32(5));
  assert.deepEqual([...rec.optionOrder].sort(), [0, 1, 2, 3]);
  assert.deepEqual(chooseOption(rec, rec.optionOrder.indexOf(2)), { isCorrect: true });
});

test('yalnızca ilk seçim sayılır', () => {
  const rec = createRecord(item(mcq), mulberry32(5));
  const wrong = rec.optionOrder.findIndex((o) => o !== 2);
  assert.deepEqual(chooseOption(rec, wrong), { isCorrect: false });
  assert.equal(chooseOption(rec, rec.optionOrder.indexOf(2)), null);
  const tf = createRecord(item({ id: 't', type: 'tf', isTrue: false }));
  assert.deepEqual(chooseTrueFalse(tf, false), { isCorrect: true });
  assert.equal(chooseTrueFalse(tf, true), null);
});

test('cevap bir kez açılır', () => {
  const rec = createRecord(item({ id: 'f', type: 'flip' }));
  assert.equal(reveal(rec), true);
  assert.equal(reveal(rec), false);
});

test('hangi kartlar 2 sn ekranda kalınca tamamlanır', () => {
  const r = (type, variant) => createRecord(item({ id: type, type, options: ['a', 'b', 'c', 'd'], correct: 0 }, variant));
  assert.equal(completesByDwell(r('fact')), true);
  assert.equal(completesByDwell(r('remember')), true);
  assert.equal(completesByDwell(r('compare')), true);
  assert.equal(completesByDwell(r('term', 'open')), true);
  assert.equal(completesByDwell(r('term', 'quiz')), false);
  assert.equal(completesByDwell(r('flip')), false);
  assert.equal(completesByDwell(r('mcq')), false);
  assert.equal(completesByDwell(r('tf')), false);
});

test('kart yalnızca bir kez tamamlanır', () => {
  const rec = createRecord(item({ id: 'f', type: 'fact' }));
  assert.equal(markCompleted(rec), true);
  assert.equal(markCompleted(rec), false);
});

test('shuffledIndices bir permütasyon üretir', () => {
  assert.deepEqual(shuffledIndices(4, () => 0.999).sort(), [0, 1, 2, 3]);
});
```

```js
// @file tests/text.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { tokenizeBold } from '../site/js/text.js';

test('kalın işaretleri ayrıştırılır', () => {
  assert.deepEqual(tokenizeBold('ACT **480 sn** üzeri'), [
    { text: 'ACT ', bold: false },
    { text: '480 sn', bold: true },
    { text: ' üzeri', bold: false },
  ]);
});

test('işaretsiz ve boş metin', () => {
  assert.deepEqual(tokenizeBold('düz'), [{ text: 'düz', bold: false }]);
  assert.deepEqual(tokenizeBold(''), []);
  assert.deepEqual(tokenizeBold(undefined), []);
});

test('kapanmayan işaret düz metin kalır', () => {
  assert.deepEqual(tokenizeBold('a **b'), [{ text: 'a **b', bold: false }]);
});
```

- [ ] **Step 2: Testleri çalıştır, başarısız olduğunu gör**

Run: `npm test`
Expected: FAIL — `feed.js`, `cardstate.js`, `text.js` bulunamadı.

- [ ] **Step 3: Modülleri yaz**

```js
// @file site/js/feed.js
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
  #seen;
  #queue;
  #pending = [];
  #reshown = new Map();
  #history = [];
  #served = 0;

  constructor(cards, { rng = Math.random, seen = [], startWith = null } = {}) {
    this.cards = cards;
    this.#rng = rng;
    this.#byId = new Map(cards.map((c) => [c.id, c]));
    this.#seen = new Set(seen.filter((id) => this.#byId.has(id)));
    this.#queue = this.#order(cards.filter((c) => !this.#seen.has(c.id)));
    if (startWith && this.#byId.has(startWith)) {
      this.#queue = [this.#byId.get(startWith), ...this.#queue.filter((c) => c.id !== startWith)];
    }
  }

  get size() { return this.cards.length; }
  get seenIds() { return [...this.#seen]; }

  #order(list) {
    return spreadOut(weightedShuffle(list, this.#rng), this.#history);
  }

  #newCycle() {
    this.#seen.clear();
    const queue = this.#order(this.cards);
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
      this.#seen.add(card.id);
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
```

```js
// @file site/js/cardstate.js
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
```

```js
// @file site/js/text.js
// "**kalın**" işaretli metni parçalara ayırır; parçalar DOM'a textContent ile yazılır.
export function tokenizeBold(input) {
  const s = String(input ?? '');
  if (!s) return [];
  const parts = s.split('**');
  if (parts.length % 2 === 0) return [{ text: s, bold: false }];
  return parts.map((text, i) => ({ text, bold: i % 2 === 1 })).filter((p) => p.text.length > 0);
}
```

- [ ] **Step 4: Testleri çalıştır, geçtiğini gör**

Run: `npm test`
Expected: PASS — feed (9), cardstate (6), text (3) dahil hepsi geçer.

- [ ] **Step 5: Kontrol noktası** — `npm test` yeşil.

---

### Task 4: Tema, uygulama kabuğu ve kart görünümleri

**Files:**
- Create: `scripts/serve.mjs`, `.claude/launch.json`
- Create: `site/js/data.js`, `site/index.html`, `site/css/styles.css`, `site/js/render.js`
- Create: `site/gallery.html`, `site/js/gallery.js` (yalnızca geliştirme vitrini; yayına girmez)
- Test: `tests/data.test.mjs`; tarayıcı denetimleri (Adım 8-10)

**Interfaces:**
- Consumes: `createRecord`, `chooseOption`, `chooseTrueFalse`, `reveal` (Task 3), `tokenizeBold` (Task 3).
- Produces (`data.js`): `COURSES: {code, name, short}[]`, `COURSE_BY_CODE: Map`, `loadAllCards(fetchImpl?, base='data/') → Promise<{cards, failed: string[]}>` (hiç kart yoksa hata fırlatır; boş ya da hatalı ders `failed` içine girer).
- Produces (`render.js`): `TYPE_LABEL`, `icon(id, cls) → SVGElement`, `renderCard(record, handlers) → HTMLElement`.
- `handlers = { isSaved(id): boolean, isFlagged(id): boolean, onToggleSave(card): boolean, onToggleFlag(card): boolean, onReveal(record), onAnswer(record, isCorrect) }`.
- Produces (`index.html` kimlikleri, Task 5 kullanır): `#feed`, `#latte`, `#latte-bar`, `#latte-level`, `#latte-count`, `#latte-won-n`, `#filter-btn`, `#filter-label`, `#filter-sheet`, `#filter-list`, `#menu-btn`, `#menu-sheet`, `#stats`, `#flags-note`, `#flags-list`, `#flags-text`, `#copy-flags`, `#reset-btn`, `#loading`, `#error`, `#error-text`, `#retry-btn`, `#empty`, `#empty-title`, `#empty-text`, `#empty-btn`, `#celebrate`, `#celebrate-text`, `#celebrate-btn`, `#confetti`, `#toast`, `#hint`, `#sky`; tema düğmeleri `[data-theme-choice="system|light|dark"]`; sprite sembolleri `i-unicorn`, `i-sparkle`, `i-star`, `i-heart`, `i-bookmark`, `i-flag`, `i-menu`, `i-chevron`, `i-close`.

- [ ] **Step 1: Veri yükleme testlerini yaz**

```js
// @file tests/data.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { COURSES, loadAllCards } from '../site/js/data.js';
import { COURSE_CODES } from '../scripts/lib/cards.mjs';

const okJson = (body) => ({ ok: true, status: 200, json: async () => body });
const card = (course, n) => ({ id: `${course}-${n}`, course, type: 'fact', topic: 'T', importance: 1, title: 't', body: 'b' });

test('ders listesi derleme betiğiyle aynı', () => {
  assert.deepEqual(COURSES.map((c) => c.code), COURSE_CODES);
});

test('bir dersin dosyası yoksa ya da bozuksa diğerleri yüklenir', async () => {
  const fetchImpl = async (url) => {
    if (url.includes('PER247')) return { ok: false, status: 404, json: async () => ({}) };
    if (url.includes('PER243')) return { ok: true, status: 200, json: async () => { throw new SyntaxError('bozuk'); } };
    const code = url.match(/PER\d{3}/)[0];
    return okJson([card(code, 1), card(code, 2), { bozuk: true }]);
  };
  const { cards, failed } = await loadAllCards(fetchImpl);
  assert.deepEqual([...failed].sort(), ['PER243', 'PER247']);
  assert.equal(cards.length, 8);
});

test('başka derse ait kart o dersin dosyasından alınmaz; boş ders başarısız sayılır', async () => {
  const fetchImpl = async (url) => okJson([card('PER141', url.match(/PER\d{3}/)[0])]);
  const { cards, failed } = await loadAllCards(fetchImpl);
  assert.equal(cards.length, 1);
  assert.equal(failed.length, 5);
});

test('hiçbir dosya yüklenemezse hata fırlatır', async () => {
  await assert.rejects(loadAllCards(async () => { throw new TypeError('ağ yok'); }), /Hiç kart yüklenemedi/);
});
```

- [ ] **Step 2: Testi çalıştır, başarısız olduğunu gör**

Run: `npm test`
Expected: FAIL — `Cannot find module '…/site/js/data.js'`

- [ ] **Step 3: Veri modülünü yaz**

```js
// @file site/js/data.js
// Ders listesi ve kart dosyalarının yüklenmesi. Bir dersin dosyası eksik ya da bozuksa diğerleri yine yüklenir.
export const COURSES = [
  { code: 'PER141', name: 'Perfüzyon Teknikleri Teknolojisi I', short: 'Perfüzyon Teknolojisi' },
  { code: 'PER207', name: 'Ekstrakorporeal Yaşam Desteği', short: 'Ekstrakorporeal Destek' },
  { code: 'PER241', name: 'Konjenital ve Pediatrik Hastalarda Perfüzyon I', short: 'Pediatrik Perfüzyon' },
  { code: 'PER243', name: 'Kardiyak Anestezi I', short: 'Kardiyak Anestezi' },
  { code: 'PER245', name: 'Yetişkin Perfüzyon I', short: 'Yetişkin Perfüzyon' },
  { code: 'PER247', name: 'Sterilizasyon ve Cerrahi Asepsi', short: 'Sterilizasyon' },
];
export const COURSE_BY_CODE = new Map(COURSES.map((c) => [c.code, c]));

export async function loadAllCards(fetchImpl = (...args) => globalThis.fetch(...args), base = 'data/') {
  const results = await Promise.allSettled(
    COURSES.map(async ({ code }) => {
      const res = await fetchImpl(`${base}${code}.json`, { cache: 'no-cache' });
      if (!res.ok) throw new Error(`${code}: HTTP ${res.status}`);
      const list = await res.json();
      if (!Array.isArray(list)) throw new Error(`${code}: beklenmeyen biçim`);
      return list.filter((c) => c && typeof c.id === 'string' && c.course === code && typeof c.type === 'string');
    }),
  );
  const cards = [];
  const failed = [];
  results.forEach((r, i) => {
    if (r.status === 'fulfilled' && r.value.length) cards.push(...r.value);
    else failed.push(COURSES[i].code);
  });
  if (!cards.length) throw new Error('Hiç kart yüklenemedi');
  return { cards, failed };
}
```

- [ ] **Step 4: Testi çalıştır, geçtiğini gör**

Run: `npm test`
Expected: PASS — data (4) dahil hepsi geçer.

- [ ] **Step 5: Önizleme sunucusunu ve başlatma ayarını yaz**

```js
// @file scripts/serve.mjs
// Önizleme için bağımlılıksız statik sunucu. Kullanım: node scripts/serve.mjs site   (PORT=5173)
import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve(process.argv[2] ?? 'site');
const port = Number(process.env.PORT ?? 5173);
const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
};

http
  .createServer(async (req, res) => {
    try {
      let rel = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
      if (rel.endsWith('/')) rel += 'index.html';
      const file = path.resolve(root, `.${rel}`);
      if (file !== root && !file.startsWith(root + path.sep)) {
        res.writeHead(403).end('Yasak');
        return;
      }
      if (!(await stat(file)).isFile()) throw new Error('dosya değil');
      res.writeHead(200, { 'content-type': TYPES[path.extname(file)] ?? 'application/octet-stream', 'cache-control': 'no-store' });
      res.end(await readFile(file));
    } catch {
      res.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' }).end('Bulunamadı');
    }
  })
  .listen(port, () => console.log(`Önizleme: http://localhost:${port}`));
```

```json
// @file .claude/launch.json
{
  "version": "0.0.1",
  "configurations": [
    { "name": "site", "runtimeExecutable": "node", "runtimeArgs": ["scripts/serve.mjs", "site"], "port": 5173 }
  ]
}
```

- [ ] **Step 6: Uygulama kabuğunu yaz**

```html
<!-- @file site/index.html -->
<!doctype html>
<html lang="tr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>Dünyanın en güzel perfüzyonisti</title>
<meta name="description" content="Perfüzyon dersleri için Reels gibi kaydırılan hap bilgi, terim ve test kartları.">
<meta name="theme-color" content="#ffe3f0">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ctext y='.9em' font-size='90'%3E%F0%9F%A6%84%3C/text%3E%3C/svg%3E">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@600;700;800&family=Nunito:ital,wght@0,400;0,600;0,700;0,800;1,600&display=swap">
<link rel="stylesheet" href="css/styles.css">
<script type="module" src="js/main.js"></script>
</head>
<body>
<svg class="sprite" width="0" height="0" aria-hidden="true" focusable="false">
  <symbol id="i-unicorn" viewBox="0 0 120 120">
    <g style="fill:var(--u-mane2)"><circle cx="40" cy="50" r="12"/><circle cx="35" cy="68" r="11.5"/><circle cx="39" cy="86" r="10.5"/><circle cx="46" cy="102" r="9.5"/></g>
    <g style="fill:var(--u-line);stroke:var(--u-line);stroke-width:6;stroke-linejoin:round">
      <path d="M50 84C47 95 45 104 45 116h34c-1-10-3-19-7-28z"/>
      <ellipse cx="64" cy="62" rx="27" ry="25"/>
      <ellipse cx="81" cy="79" rx="21" ry="16"/>
      <path d="M51 44l3-22 13 16z"/>
    </g>
    <g style="fill:var(--u-face)">
      <path d="M50 84C47 95 45 104 45 116h34c-1-10-3-19-7-28z"/>
      <ellipse cx="64" cy="62" rx="27" ry="25"/>
      <ellipse cx="81" cy="79" rx="21" ry="16"/>
      <path d="M51 44l3-22 13 16z"/>
    </g>
    <path d="M54.5 38l1.6-10 6 7.4z" style="fill:var(--u-blush)"/>
    <path d="M68 39L85 5l-2 37z" style="fill:var(--u-horn);stroke:var(--u-horn-line);stroke-width:2;stroke-linejoin:round"/>
    <path d="M72 31l10 2.5M75.5 23l7.5 2M79 15l5 1.4" style="fill:none;stroke:var(--u-horn-line);stroke-width:2;stroke-linecap:round"/>
    <g style="fill:var(--u-mane1)"><circle cx="57" cy="40" r="8.5"/><circle cx="47" cy="45" r="8"/><circle cx="40" cy="57" r="7"/></g>
    <circle cx="64" cy="41" r="5" style="fill:var(--u-mane3)"/>
    <path d="M59 62q6 6 12 0" style="fill:none;stroke:var(--u-line);stroke-width:3.2;stroke-linecap:round"/>
    <path d="M60.5 64.5l-3 3M64.5 66.2l-1 3.8" style="fill:none;stroke:var(--u-line);stroke-width:2.2;stroke-linecap:round"/>
    <ellipse cx="63" cy="75" rx="6.5" ry="3.8" style="fill:var(--u-blush);opacity:.7"/>
    <ellipse cx="92" cy="77" rx="1.9" ry="2.6" style="fill:var(--u-line)"/>
    <path d="M80 88q5 3.5 10-.5" style="fill:none;stroke:var(--u-line);stroke-width:2.6;stroke-linecap:round"/>
    <path d="M100 18c.5 3.2 2 4.7 5.4 5.4-3.4.7-4.9 2.2-5.4 5.4-.5-3.2-2-4.7-5.4-5.4 3.4-.7 4.9-2.2 5.4-5.4z" style="fill:var(--gold)"/>
    <path d="M22 26c.4 2.4 1.5 3.5 4 4-2.5.5-3.6 1.6-4 4-.4-2.4-1.5-3.5-4-4 2.5-.5 3.6-1.6 4-4z" style="fill:var(--u-mane1)"/>
  </symbol>
  <symbol id="i-sparkle" viewBox="0 0 24 24"><path d="M12 1.5c.9 5.4 3.6 8.1 10.5 10.5-6.9 2.4-9.6 5.1-10.5 10.5C11.1 17.1 8.4 14.4 1.5 12 8.4 9.6 11.1 6.9 12 1.5z"/></symbol>
  <symbol id="i-star" viewBox="0 0 24 24"><path d="M12 2.6l2.8 5.9 6.4.8-4.7 4.4 1.2 6.4L12 17l-5.7 3.1 1.2-6.4-4.7-4.4 6.4-.8z" stroke-linejoin="round"/></symbol>
  <symbol id="i-heart" viewBox="0 0 24 24"><path d="M12 21s-8.5-5.3-8.5-11.2C3.5 6.6 5.9 4.5 8.6 4.5c1.6 0 2.7.8 3.4 1.9.7-1.1 1.8-1.9 3.4-1.9 2.7 0 5.1 2.1 5.1 5.3C20.5 15.7 12 21 12 21z"/></symbol>
  <symbol id="i-bookmark" viewBox="0 0 24 24"><path d="M6.5 3.5h11a1 1 0 0 1 1 1v16l-6.5-4.2-6.5 4.2v-16a1 1 0 0 1 1-1z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></symbol>
  <symbol id="i-flag" viewBox="0 0 24 24"><path d="M5.5 21V4.5h11.5l-2.4 4 2.4 4H5.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></symbol>
  <symbol id="i-menu" viewBox="0 0 24 24"><path d="M4 7h16M4 12h16M4 17h10" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></symbol>
  <symbol id="i-chevron" viewBox="0 0 24 24"><path d="M6 9.5l6 6 6-6" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></symbol>
  <symbol id="i-close" viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></symbol>
</svg>

<div class="sky" id="sky" aria-hidden="true"></div>

<header class="topbar">
  <div class="topbar__row">
    <div class="brand">
      <svg class="brand__mark" aria-hidden="true"><use href="#i-unicorn"/></svg>
      <span class="brand__name">Dünyanın en güzel perfüzyonisti</span>
    </div>
    <button class="icon-btn" id="menu-btn" type="button" aria-label="Menü ve istatistikler" aria-haspopup="dialog">
      <svg aria-hidden="true"><use href="#i-menu"/></svg>
    </button>
  </div>
  <div class="topbar__row">
    <button class="chip" id="filter-btn" type="button" aria-haspopup="dialog">
      <span class="chip__label" id="filter-label">Tümü</span>
      <svg aria-hidden="true"><use href="#i-chevron"/></svg>
    </button>
    <div class="latte" id="latte" role="progressbar" aria-label="Gofrikli latte barı" aria-valuemin="0" aria-valuemax="50" aria-valuenow="0" aria-valuetext="50 karttan 0 tanesi tamamlandı">
      <svg class="latte__cup" viewBox="0 0 40 44" aria-hidden="true">
        <defs><clipPath id="cup-clip"><path d="M6 13h24l-2.4 25.2a4 4 0 0 1-4 3.6H12.4a4 4 0 0 1-4-3.6z"/></clipPath></defs>
        <g transform="rotate(16 27 10)">
          <rect x="24.5" y="0.5" width="5" height="17" rx="2.5" style="fill:var(--wafer)"/>
          <path d="M24.5 5h5M24.5 9h5M24.5 13h5" style="stroke:var(--u-horn-line);stroke-width:1"/>
        </g>
        <g clip-path="url(#cup-clip)">
          <rect x="0" y="13" width="40" height="30" style="fill:var(--surface)"/>
          <g id="latte-level" class="latte__level">
            <rect x="0" y="13" width="40" height="32" style="fill:var(--latte)"/>
            <rect x="0" y="13" width="40" height="4" style="fill:var(--foam)"/>
          </g>
        </g>
        <path d="M30 18h2.6a4.6 4.6 0 0 1 0 9.2H29" style="fill:none;stroke:var(--ink);stroke-width:2.2;stroke-linecap:round"/>
        <path d="M6 13h24l-2.4 25.2a4 4 0 0 1-4 3.6H12.4a4 4 0 0 1-4-3.6z" style="fill:none;stroke:var(--ink);stroke-width:2.2;stroke-linejoin:round"/>
        <path d="M18 31.5s-4.2-2.6-4.2-5.4c0-1.6 1.2-2.6 2.5-2.6.8 0 1.4.4 1.7.9.3-.5.9-.9 1.7-.9 1.3 0 2.5 1 2.5 2.6 0 2.8-4.2 5.4-4.2 5.4z" style="fill:var(--accent)"/>
      </svg>
      <div class="latte__track"><div class="latte__bar" id="latte-bar"></div></div>
      <span class="latte__count" id="latte-count">0/50</span>
    </div>
    <span class="latte__won" title="Kazanılan latte">☕ <b id="latte-won-n">0</b></span>
  </div>
</header>

<main class="feed" id="feed" tabindex="-1" aria-label="Kart akışı"></main>

<div class="screen" id="loading" role="status">
  <svg class="screen__unicorn bob" aria-hidden="true"><use href="#i-unicorn"/></svg>
  <p class="screen__title">Kartlar hazırlanıyor</p>
  <p class="screen__text">Biraz sabır, sihir yükleniyor ✨</p>
</div>

<div class="screen" id="error" hidden>
  <svg class="screen__unicorn" aria-hidden="true"><use href="#i-unicorn"/></svg>
  <p class="screen__title">Kartlar yüklenemedi</p>
  <p class="screen__text" id="error-text">İnternet bağlantını kontrol edip tekrar dene.</p>
  <button class="btn" id="retry-btn" type="button">Tekrar dene</button>
</div>

<div class="screen screen--under-bar" id="empty" hidden>
  <svg class="screen__unicorn" aria-hidden="true"><use href="#i-unicorn"/></svg>
  <p class="screen__title" id="empty-title">Burada henüz kart yok</p>
  <p class="screen__text" id="empty-text">Beğendiğin kartlarda “Kaydet”e dokun, hepsi burada toplansın.</p>
  <button class="btn" id="empty-btn" type="button">Tüm kartlara dön</button>
</div>

<dialog class="sheet" id="filter-sheet" aria-labelledby="filter-title">
  <div class="sheet__head">
    <h2 class="sheet__title" id="filter-title">Ne çalışalım?</h2>
    <button class="icon-btn" type="button" data-close aria-label="Kapat"><svg aria-hidden="true"><use href="#i-close"/></svg></button>
  </div>
  <div class="sheet__list" id="filter-list" role="radiogroup" aria-labelledby="filter-title"></div>
</dialog>

<dialog class="sheet" id="menu-sheet" aria-labelledby="menu-title">
  <div class="sheet__head">
    <h2 class="sheet__title" id="menu-title">Senin köşen</h2>
    <button class="icon-btn" type="button" data-close aria-label="Kapat"><svg aria-hidden="true"><use href="#i-close"/></svg></button>
  </div>
  <div class="stats" id="stats"></div>
  <section class="sheet__section">
    <h3 class="sheet__sub">Görünüm</h3>
    <div class="segmented" role="radiogroup" aria-label="Görünüm">
      <button type="button" role="radio" data-theme-choice="system">Otomatik</button>
      <button type="button" role="radio" data-theme-choice="light">Pembe gündüz</button>
      <button type="button" role="radio" data-theme-choice="dark">Yıldızlı gece</button>
    </div>
  </section>
  <section class="sheet__section">
    <h3 class="sheet__sub">“Hatalı olabilir” dediğin kartlar</h3>
    <p class="sheet__note" id="flags-note"></p>
    <ul class="flags" id="flags-list"></ul>
    <textarea class="flags__text" id="flags-text" readonly hidden aria-label="Kopyalanacak liste"></textarea>
    <button class="btn btn--soft" id="copy-flags" type="button">Listeyi kopyala</button>
  </section>
  <section class="sheet__section">
    <button class="btn btn--ghost" id="reset-btn" type="button">İlerlemeyi sıfırla</button>
  </section>
</dialog>

<div class="celebrate" id="celebrate" role="dialog" aria-modal="true" aria-labelledby="celebrate-title" hidden>
  <div class="confetti" id="confetti" aria-hidden="true"></div>
  <div class="celebrate__card">
    <svg class="celebrate__unicorn" aria-hidden="true"><use href="#i-unicorn"/></svg>
    <p class="celebrate__kicker">50 kart tamam!</p>
    <h2 class="celebrate__title" id="celebrate-title">Gofrikli latteyi kazandın! ☕</h2>
    <p class="celebrate__text" id="celebrate-text">Şimdiye kadar 1 latte kazandın.</p>
    <button class="btn" id="celebrate-btn" type="button">Devam et 💖</button>
  </div>
</div>

<div class="toast" id="toast" role="status" aria-live="polite" hidden></div>
<div class="hint" id="hint" aria-hidden="true" hidden>Yukarı kaydır ✨</div>
</body>
</html>
```

- [ ] **Step 7: Stil dosyasını yaz**

```css
/* @file site/css/styles.css */
/* Düzen: tam ekran dikey akış (her slayt bir kart); üstte sabit bar (marka, filtre, latte barı);
   kartlar yumuşak, yuvarlak, türüne göre pastel tonlu. Açık tema pastel pembe, koyu tema yıldızlı gece. */
:root {
  --bg: #fff0f6;
  --bg-2: #ffe0ee;
  --surface: #ffffff;
  --surface-2: #fff6fa;
  --ink: #3a1430;
  --ink-2: #7a4568;
  --line: #f6c3db;
  --accent: #d63374;
  --accent-ink: #b01f5c;
  --accent-soft: #ffd4e7;
  --on-accent: #ffffff;
  --lilac: #efe5ff;
  --lilac-ink: #6a3cb8;
  --mint: #dcf6ec;
  --mint-ink: #1d7656;
  --sky: #e0eeff;
  --sky-ink: #2c5aa3;
  --peach: #ffe6d6;
  --peach-ink: #a8481f;
  --lemon: #fff4c7;
  --lemon-ink: #7f5d00;
  --gold: #f7b928;
  --good: #1f8a5b;
  --good-soft: #d7f4e6;
  --bad: #c93a4a;
  --bad-soft: #ffe0e4;
  --shadow: 0 14px 34px rgb(214 51 116 / 0.16), 0 2px 6px rgb(58 20 48 / 0.06);
  --backdrop: rgb(58 20 48 / 0.42);
  --star: #f6a5c8;
  --u-face: #ffffff;
  --u-line: #5b2a4c;
  --u-mane1: #ff9cc9;
  --u-mane2: #c9a8ff;
  --u-mane3: #9fe3cf;
  --u-horn: #ffd36b;
  --u-horn-line: #e8a93a;
  --u-blush: #ff9cc9;
  --latte: #c98b5b;
  --foam: #fff3e6;
  --wafer: #e2a65c;
  --font-display: "Baloo 2", "Nunito", ui-rounded, "Arial Rounded MT Bold", system-ui, sans-serif;
  --font-body: "Nunito", ui-rounded, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  --radius-card: 28px;
  --radius-pill: 999px;
  --topbar-h: 108px;
  color-scheme: light;
}

@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    --bg: #1a0c29; --bg-2: #2a1342; --surface: #2d1845; --surface-2: #372052;
    --ink: #fff0f8; --ink-2: #d8b6d3; --line: #4f2d6c;
    --accent: #ff77b4; --accent-ink: #ff9fcb; --accent-soft: #4b1f52; --on-accent: #2a0a20;
    --lilac: #392b62; --lilac-ink: #cdb8ff; --mint: #173d38; --mint-ink: #8fe5c7;
    --sky: #1d3156; --sky-ink: #a9c8ff; --peach: #47291f; --peach-ink: #ffbf9b;
    --lemon: #3d3415; --lemon-ink: #ffe08a; --gold: #ffd76b;
    --good: #6fe0a8; --good-soft: #163d2e; --bad: #ff8b98; --bad-soft: #4a1d27;
    --shadow: 0 14px 34px rgb(0 0 0 / 0.35), 0 0 0 1px rgb(255 160 210 / 0.06);
    --backdrop: rgb(8 2 16 / 0.6); --star: #fff2b8;
    --u-face: #fff7fc; --u-line: #3b1a39; --foam: #ffe9d6;
    color-scheme: dark;
  }
}
:root[data-theme="dark"] {
  --bg: #1a0c29; --bg-2: #2a1342; --surface: #2d1845; --surface-2: #372052;
  --ink: #fff0f8; --ink-2: #d8b6d3; --line: #4f2d6c;
  --accent: #ff77b4; --accent-ink: #ff9fcb; --accent-soft: #4b1f52; --on-accent: #2a0a20;
  --lilac: #392b62; --lilac-ink: #cdb8ff; --mint: #173d38; --mint-ink: #8fe5c7;
  --sky: #1d3156; --sky-ink: #a9c8ff; --peach: #47291f; --peach-ink: #ffbf9b;
  --lemon: #3d3415; --lemon-ink: #ffe08a; --gold: #ffd76b;
  --good: #6fe0a8; --good-soft: #163d2e; --bad: #ff8b98; --bad-soft: #4a1d27;
  --shadow: 0 14px 34px rgb(0 0 0 / 0.35), 0 0 0 1px rgb(255 160 210 / 0.06);
  --backdrop: rgb(8 2 16 / 0.6); --star: #fff2b8;
  --u-face: #fff7fc; --u-line: #3b1a39; --foam: #ffe9d6;
  color-scheme: dark;
}

*, *::before, *::after { box-sizing: border-box; }
[hidden] { display: none !important; }
html, body { height: 100%; }
body {
  margin: 0;
  background: var(--bg);
  color: var(--ink);
  font-family: var(--font-body);
  font-size: 16px;
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
  -webkit-tap-highlight-color: transparent;
  overflow: hidden;
  overscroll-behavior: none;
}
body::before {
  content: "";
  position: fixed;
  inset: 0;
  z-index: -2;
  pointer-events: none;
  background:
    radial-gradient(120% 70% at 50% -10%, var(--bg-2), transparent 60%),
    radial-gradient(80% 50% at 100% 100%, var(--lilac), transparent 70%);
}
button { font: inherit; color: inherit; }
:focus-visible { outline: 3px solid var(--accent-ink); outline-offset: 2px; border-radius: 12px; }
.sprite { position: absolute; width: 0; height: 0; overflow: hidden; }

/* Arka plan parıltıları */
.sky { position: fixed; inset: 0; z-index: -1; overflow: hidden; pointer-events: none; }
.sky__star {
  position: absolute;
  left: var(--x);
  top: var(--y);
  width: var(--s);
  height: var(--s);
  fill: var(--star);
  opacity: 0.5;
  animation: twinkle var(--d) ease-in-out var(--delay) infinite;
}
@keyframes twinkle {
  0%, 100% { transform: scale(0.6) rotate(0deg); opacity: 0.25; }
  50% { transform: scale(1) rotate(20deg); opacity: 0.85; }
}

/* Üst bar */
.topbar {
  position: fixed;
  inset: 0 0 auto 0;
  z-index: 10;
  display: grid;
  gap: 8px;
  padding: calc(env(safe-area-inset-top, 0px) + 10px) 16px 10px;
  background: linear-gradient(to bottom, var(--bg) 72%, transparent);
}
.topbar__row { display: flex; align-items: center; gap: 8px; width: 100%; max-width: 560px; min-width: 0; margin-inline: auto; }
.brand { display: flex; align-items: center; gap: 8px; flex: 1; min-width: 0; }
.brand__mark { width: 30px; height: 30px; flex: none; }
.brand__name {
  font-family: var(--font-display);
  font-weight: 800;
  font-size: clamp(13px, 4.2vw, 19px);
  line-height: 1.1;
  color: var(--accent-ink);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.icon-btn {
  flex: none;
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  border: 0;
  border-radius: 50%;
  background: var(--surface);
  color: var(--ink);
  box-shadow: var(--shadow);
  cursor: pointer;
}
.icon-btn svg { width: 22px; height: 22px; }
.chip {
  flex: none;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  max-width: 42vw;
  height: 34px;
  padding: 0 10px 0 14px;
  border: 2px solid var(--line);
  border-radius: var(--radius-pill);
  background: var(--surface);
  color: var(--ink);
  font-weight: 800;
  font-size: 14px;
  cursor: pointer;
}
.chip__label { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.chip svg { width: 18px; height: 18px; flex: none; }
.latte { flex: 1; min-width: 0; display: flex; align-items: center; gap: 6px; }
.latte__cup { width: 30px; height: 33px; flex: none; overflow: visible; }
.latte__level { transform: translateY(29px); transition: transform 0.45s cubic-bezier(0.2, 0.9, 0.3, 1.2); }
.latte__track {
  flex: 1;
  min-width: 36px;
  height: 12px;
  border-radius: var(--radius-pill);
  background: var(--accent-soft);
  overflow: hidden;
}
.latte__bar {
  width: 0%;
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, var(--u-mane2), var(--accent));
  transition: width 0.45s cubic-bezier(0.2, 0.9, 0.3, 1.2);
}
.latte__count { flex: none; font-weight: 800; font-size: 13px; font-variant-numeric: tabular-nums; color: var(--ink-2); }
.latte__won {
  flex: none;
  padding: 4px 10px;
  border-radius: var(--radius-pill);
  background: var(--surface);
  box-shadow: var(--shadow);
  font-weight: 800;
  font-size: 14px;
  font-variant-numeric: tabular-nums;
}
.latte.is-bump .latte__cup { animation: bump 0.5s ease; }
@keyframes bump { 40% { transform: scale(1.18) rotate(-6deg); } }

/* Akış */
.feed {
  position: fixed;
  inset: 0;
  overflow-x: hidden;
  overflow-y: auto;
  scroll-snap-type: y mandatory;
  overscroll-behavior-y: contain;
  scrollbar-width: none;
  outline: none;
}
.feed::-webkit-scrollbar { display: none; }
.slide {
  height: 100%;
  scroll-snap-align: start;
  scroll-snap-stop: always;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: calc(env(safe-area-inset-top, 0px) + var(--topbar-h)) 16px calc(env(safe-area-inset-bottom, 0px) + 20px);
}

/* Kart */
.card {
  --tone: var(--lilac);
  --tone-ink: var(--lilac-ink);
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 14px;
  width: min(100%, 520px);
  max-height: 100%;
  overflow-y: auto;
  padding: 20px 20px 16px;
  border: 2px solid var(--line);
  border-radius: var(--radius-card);
  background: var(--surface);
  box-shadow: var(--shadow);
  overflow-wrap: anywhere;
  hyphens: auto;
}
.card[data-type="term"] { --tone: var(--lilac); --tone-ink: var(--lilac-ink); }
.card[data-type="fact"] { --tone: var(--mint); --tone-ink: var(--mint-ink); }
.card[data-type="flip"] { --tone: var(--sky); --tone-ink: var(--sky-ink); }
.card[data-type="mcq"] { --tone: var(--peach); --tone-ink: var(--peach-ink); }
.card[data-type="tf"] { --tone: var(--lemon); --tone-ink: var(--lemon-ink); }
.card[data-type="compare"] { --tone: var(--accent-soft); --tone-ink: var(--accent-ink); }
.card[data-type="remember"] {
  --tone: var(--accent);
  --tone-ink: var(--on-accent);
  border: 2px dashed var(--accent);
  background: linear-gradient(160deg, var(--accent-soft), var(--surface) 58%);
}
.card__deco { position: absolute; top: 14px; right: 14px; width: 22px; height: 22px; fill: var(--accent); opacity: 0.35; pointer-events: none; }
.card__meta { display: grid; gap: 6px; padding-right: 26px; }
.card__tags { display: flex; flex-wrap: wrap; gap: 6px; }
.tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border-radius: var(--radius-pill);
  background: var(--tone);
  color: var(--tone-ink);
  font-size: 13px;
  font-weight: 800;
}
.tag--hot { background: var(--lemon); color: var(--lemon-ink); }
.tag--again { background: var(--bad-soft); color: var(--bad); }
.card p { margin: 0; }
.card__course { font-size: 13px; font-weight: 700; color: var(--ink-2); }
.card__course strong { color: var(--accent-ink); }
.card__topic { font-size: 12.5px; font-weight: 800; letter-spacing: 0.06em; text-transform: uppercase; color: var(--ink-2); }
.card__body { display: grid; gap: 14px; }
.card__title {
  margin: 0;
  font-family: var(--font-display);
  font-weight: 800;
  font-size: clamp(22px, 6.2vw, 28px);
  line-height: 1.15;
  text-wrap: balance;
}
.card__text { font-size: clamp(17px, 4.6vw, 19px); line-height: 1.55; }
.card strong { color: var(--accent-ink); font-weight: 800; }

/* Terim, soru, cevap */
.term__word {
  font-family: var(--font-display);
  font-weight: 800;
  font-size: clamp(30px, 9vw, 40px);
  line-height: 1.05;
  text-wrap: balance;
}
.term__en { font-style: italic; font-weight: 600; color: var(--ink-2); }
.term__origin {
  display: flex;
  align-items: center;
  gap: 6px;
  justify-self: start;
  padding: 6px 12px;
  border-radius: 14px;
  background: var(--tone);
  color: var(--tone-ink);
  font-size: 14px;
  font-weight: 700;
}
.icon--tiny { width: 14px; height: 14px; flex: none; fill: currentColor; }
.ask { font-size: 15px; font-weight: 800; color: var(--tone-ink); }
.card[data-type="remember"] .ask { color: var(--accent-ink); }
.q { font-size: clamp(18px, 5vw, 21px); font-weight: 800; line-height: 1.35; }
.reveal-btn {
  min-height: 54px;
  border: 2px dashed var(--tone-ink);
  border-radius: 18px;
  background: var(--tone);
  color: var(--tone-ink);
  font-size: 17px;
  font-weight: 800;
  cursor: pointer;
}
.answer { display: grid; gap: 12px; padding: 14px; border: 2px solid var(--line); border-radius: 18px; background: var(--surface-2); }
.pop-in { animation: pop 0.35s cubic-bezier(0.2, 0.9, 0.3, 1.3); }
@keyframes pop { from { transform: scale(0.94); opacity: 0; } }

/* Test ve doğru/yanlış */
.options { display: grid; gap: 10px; }
.opt {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  min-height: 52px;
  padding: 10px 14px;
  border: 2px solid var(--line);
  border-radius: 18px;
  background: var(--surface-2);
  color: var(--ink);
  font-size: 16px;
  font-weight: 700;
  line-height: 1.35;
  text-align: left;
  cursor: pointer;
  transition: transform 0.12s ease, background-color 0.2s ease, border-color 0.2s ease;
}
.opt:active { transform: scale(0.98); }
.opt:disabled { cursor: default; color: var(--ink); opacity: 1; }
.opt__letter {
  flex: none;
  display: grid;
  place-items: center;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: var(--tone);
  color: var(--tone-ink);
  font-weight: 800;
}
.opt__text { min-width: 0; }
.opt.is-correct { border-color: var(--good); background: var(--good-soft); }
.opt.is-correct .opt__letter { background: var(--good); color: var(--surface); }
.opt.is-wrong { border-color: var(--bad); background: var(--bad-soft); animation: shake 0.35s ease; }
.opt.is-wrong .opt__letter { background: var(--bad); color: var(--surface); }
.opt.is-dim { opacity: 0.55; }
@keyframes shake { 25% { transform: translateX(-4px); } 75% { transform: translateX(4px); } }
.tf { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; }
.tf .opt { justify-content: center; font-size: 17px; text-align: center; }
.explain { display: grid; gap: 6px; padding: 12px 14px; border: 2px solid var(--line); border-radius: 18px; background: var(--surface-2); font-size: 15.5px; }
.explain.is-good { border-color: var(--good); }
.explain.is-bad { border-color: var(--bad); }
.explain__verdict { font-weight: 800; }
.explain.is-good .explain__verdict { color: var(--good); }
.explain.is-bad .explain__verdict { color: var(--bad); }

/* Karıştırma */
.compare { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; }
.side { min-width: 0; padding: 12px; border: 2px solid var(--u-mane2); border-radius: 18px; background: var(--surface-2); }
.side + .side { border-color: var(--u-mane1); }
.side h4 { margin: 0 0 6px; font-family: var(--font-display); font-size: 18px; line-height: 1.15; color: var(--accent-ink); }
.side ul { display: grid; gap: 4px; margin: 0; padding-left: 18px; font-size: 14.5px; line-height: 1.4; }

/* Kart düğmeleri */
.card__actions { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; margin-top: auto; padding-top: 4px; }
.act {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 36px;
  padding: 0 12px;
  border: 0;
  border-radius: var(--radius-pill);
  background: var(--surface-2);
  color: var(--ink-2);
  font-size: 13.5px;
  font-weight: 800;
  cursor: pointer;
}
.act svg { width: 18px; height: 18px; flex: none; fill: none; }
.act[aria-pressed="true"] { background: var(--accent-soft); color: var(--accent-ink); }
.act[aria-pressed="true"] svg { fill: currentColor; }
.card__source { flex-basis: 100%; font-size: 12px; color: var(--ink-2); }

/* İpucu, ekranlar, düğmeler */
.hint {
  position: fixed;
  left: 50%;
  bottom: calc(env(safe-area-inset-bottom, 0px) + 18px);
  z-index: 12;
  padding: 8px 16px;
  border-radius: var(--radius-pill);
  background: var(--ink);
  color: var(--bg);
  font-weight: 800;
  box-shadow: var(--shadow);
  pointer-events: none;
  transform: translateX(-50%);
  animation: float 1.6s ease-in-out infinite;
}
@keyframes float { 50% { transform: translate(-50%, -8px); } }
.screen {
  position: fixed;
  inset: 0;
  z-index: 20;
  display: grid;
  place-content: center;
  justify-items: center;
  gap: 10px;
  padding: 24px 16px;
  background: var(--bg);
  text-align: center;
}
.screen--under-bar { z-index: 5; padding-top: calc(env(safe-area-inset-top, 0px) + var(--topbar-h) + 24px); }
.screen__unicorn { width: 120px; height: 120px; }
.screen__title { margin: 0; font-family: var(--font-display); font-weight: 800; font-size: 26px; color: var(--accent-ink); }
.screen__text { max-width: 32ch; margin: 0; color: var(--ink-2); }
.bob { animation: bob 1.8s ease-in-out infinite; }
@keyframes bob { 50% { transform: translateY(-10px) rotate(-3deg); } }
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 50px;
  padding: 0 24px;
  border: 0;
  border-radius: var(--radius-pill);
  background: var(--accent);
  color: var(--on-accent);
  font-size: 17px;
  font-weight: 800;
  box-shadow: var(--shadow);
  cursor: pointer;
}
.btn--soft { background: var(--accent-soft); color: var(--accent-ink); box-shadow: none; }
.btn--ghost { border: 2px solid var(--bad-soft); background: transparent; color: var(--bad); box-shadow: none; }
.btn--ghost.is-armed { background: var(--bad-soft); }

/* Alt sayfalar (filtre, menü) */
.sheet {
  width: min(100%, 560px);
  max-width: 100%;
  max-height: 85dvh;
  margin: auto auto 0;
  padding: 18px 16px calc(env(safe-area-inset-bottom, 0px) + 20px);
  border: 0;
  border-radius: 28px 28px 0 0;
  background: var(--surface);
  color: var(--ink);
  box-shadow: var(--shadow);
  overflow-y: auto;
}
.sheet[open] { animation: sheet-in 0.28s cubic-bezier(0.2, 0.9, 0.3, 1.1); }
@keyframes sheet-in { from { transform: translateY(40px); opacity: 0; } }
.sheet::backdrop { background: var(--backdrop); }
.sheet__head { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 12px; }
.sheet__title { margin: 0; font-family: var(--font-display); font-size: 24px; line-height: 1.15; color: var(--accent-ink); }
.sheet__list { display: grid; gap: 8px; }
.pick {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 12px 14px;
  border: 2px solid var(--line);
  border-radius: 18px;
  background: var(--surface-2);
  color: var(--ink);
  text-align: left;
  cursor: pointer;
}
.pick[aria-checked="true"] { border-color: var(--accent); background: var(--accent-soft); }
.pick:disabled { opacity: 0.5; cursor: not-allowed; }
.pick__main { display: grid; flex: 1; min-width: 0; }
.pick__title { font-weight: 800; }
.pick__sub { font-size: 13px; color: var(--ink-2); }
.pick__count { flex: none; font-weight: 800; font-variant-numeric: tabular-nums; color: var(--accent-ink); }
.sheet__section { display: grid; gap: 10px; margin-top: 16px; padding-top: 16px; border-top: 2px dashed var(--line); }
.sheet__sub { margin: 0; font-size: 15px; font-weight: 800; }
.sheet__note { margin: 0; font-size: 14px; color: var(--ink-2); }
.stats { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px; }
.stat { padding: 12px; border: 2px solid var(--line); border-radius: 18px; background: var(--surface-2); }
.stat__n { display: block; font-family: var(--font-display); font-weight: 800; font-size: 26px; line-height: 1.1; font-variant-numeric: tabular-nums; color: var(--accent-ink); }
.stat__label { font-size: 13px; font-weight: 700; color: var(--ink-2); }
.segmented { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 6px; padding: 4px; border-radius: 18px; background: var(--surface-2); }
.segmented button { min-height: 40px; border: 0; border-radius: 14px; background: transparent; color: var(--ink-2); font-size: 13.5px; font-weight: 800; cursor: pointer; }
.segmented button[aria-checked="true"] { background: var(--surface); color: var(--accent-ink); box-shadow: var(--shadow); }
.flags { display: grid; gap: 6px; max-height: 30vh; margin: 0; padding: 0; overflow-y: auto; list-style: none; }
.flags li { padding: 8px 10px; border-radius: 12px; background: var(--surface-2); font-size: 14px; }
.flags code { font-size: 12px; color: var(--ink-2); }
.flags__text {
  width: 100%;
  min-height: 120px;
  padding: 10px;
  border: 2px solid var(--line);
  border-radius: 12px;
  background: var(--surface-2);
  color: var(--ink);
  font: 13px/1.4 ui-monospace, Menlo, Consolas, monospace;
}

/* Kutlama */
.celebrate {
  position: fixed;
  inset: 0;
  z-index: 30;
  display: grid;
  place-items: center;
  padding: 24px 16px;
  background: radial-gradient(circle at 50% 40%, var(--accent-soft), var(--backdrop) 70%);
}
.celebrate__card {
  position: relative;
  display: grid;
  justify-items: center;
  gap: 8px;
  width: min(100%, 400px);
  padding: 26px 22px 22px;
  border-radius: 32px;
  background: var(--surface);
  box-shadow: var(--shadow);
  text-align: center;
  animation: pop 0.5s cubic-bezier(0.2, 0.9, 0.3, 1.4);
}
.celebrate__unicorn { width: 130px; height: 130px; animation: bob 1.6s ease-in-out infinite; }
.celebrate__kicker { margin: 0; font-size: 13px; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase; color: var(--ink-2); }
.celebrate__title { margin: 0; font-family: var(--font-display); font-weight: 800; font-size: clamp(26px, 7.5vw, 32px); line-height: 1.1; color: var(--accent-ink); text-wrap: balance; }
.celebrate__text { margin: 0 0 8px; color: var(--ink-2); }
.confetti { position: absolute; inset: 0; overflow: hidden; pointer-events: none; }
.confetti__bit {
  position: absolute;
  top: -40px;
  left: var(--x);
  width: var(--s);
  height: var(--s);
  fill: var(--c);
  animation: fall var(--d) linear var(--delay) forwards;
}
@keyframes fall { to { transform: translateY(110vh) rotate(var(--r)); } }

/* Bildirim */
.toast {
  position: fixed;
  left: 50%;
  bottom: calc(env(safe-area-inset-bottom, 0px) + 24px);
  z-index: 40;
  max-width: min(92vw, 420px);
  padding: 10px 18px;
  border-radius: var(--radius-pill);
  background: var(--ink);
  color: var(--bg);
  box-shadow: var(--shadow);
  font-size: 14.5px;
  font-weight: 700;
  text-align: center;
  transform: translateX(-50%);
}
.toast.is-in { animation: toast-in 0.25s ease; }
@keyframes toast-in { from { transform: translate(-50%, 12px); opacity: 0; } }

/* Küçük ve kısa ekranlar */
@media (max-width: 359px) {
  .compare { grid-template-columns: 1fr; }
  .card { padding: 16px 14px 14px; }
}
@media (max-height: 640px) {
  :root { --topbar-h: 102px; }
  .card { gap: 10px; padding: 16px 16px 12px; }
  .card__body { gap: 10px; }
  .opt { min-height: 44px; padding: 8px 12px; font-size: 15px; }
  .term__word { font-size: clamp(26px, 8vw, 34px); }
  .card__text { font-size: 16.5px; }
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
  .sky, .confetti { display: none; }
}
```

- [ ] **Step 8: Kart çizimini yaz**

```js
// @file site/js/render.js
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
```

- [ ] **Step 9: Geliştirme vitrinini yaz**

```html
<!-- @file site/gallery.html -->
<!doctype html>
<html lang="tr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>Kart vitrini</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@600;700;800&family=Nunito:ital,wght@0,400;0,600;0,700;0,800;1,600&display=swap">
<link rel="stylesheet" href="css/styles.css">
<style>
  body { overflow: auto; }
  .gallery { display: grid; justify-items: center; gap: 28px; padding: 24px 16px 64px; }
  .gallery h2 { margin: 0; font-family: var(--font-display); color: var(--accent-ink); }
  .gallery .card { max-height: none; }
</style>
<script type="module" src="js/gallery.js"></script>
</head>
<body>
<main class="gallery" id="gallery"></main>
</body>
</html>
```

```js
// @file site/js/gallery.js
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
```

- [ ] **Step 10: Vitrini tarayıcıda denetle**

1. Run: `npm run build:fixtures` — Expected: `✓ PER207: 2 kart`, `✓ PER245: 8 kart`.
2. `preview_start` ile `site` yapılandırmasını başlat, `http://localhost:5173/gallery.html` adresine git.
3. `resize_window` preset `mobile` (375×812), ekran görüntüsü al. Beklenen: pastel pembe zemin, her kart türü kendi tonunda, rozetler ("📖 Terim" vb.), ders satırı "PER245 · Yetişkin Perfüzyon I", Türkçe karakterler (ğ, ş, ı, İ) Baloo 2 / Nunito ile çiziliyor.
4. Yazı tipi denetimi (`javascript_tool`): `document.fonts.check('800 20px "Baloo 2"', 'ğüşıöçİ') && document.fonts.check('700 16px Nunito', 'ğüşıöçİ')` → `true`.
5. Bir test şıkkına ve "Anlamını gör ✨" düğmesine tıkla; beklenen: doğru şık yeşil, yanlış seçim kırmızı + açıklama; cevap açılır.
6. `resize_window` 320×568, taşma denetimi (`javascript_tool`):
   `[document.documentElement.scrollWidth <= innerWidth, ...[...document.querySelectorAll('.card')].map(c => c.scrollWidth <= c.clientWidth)].every(Boolean)` → `true`.
7. `resize_window` `colorScheme: 'dark'`, ekran görüntüsü al. Beklenen: koyu mor zemin, okunur pembe/krem metin, unicorn görünür.
8. Görsel sorun varsa (çakışma, okunmayan renk, kesilen metin) `styles.css` içinde düzelt ve 3. adımı bir kez tekrarla.
9. `resize_window` preset `desktop` ile boyutu sıfırla.

- [ ] **Step 11: Kontrol noktası** — `npm test` yeşil; vitrin 375 ve 320 px'te taşmasız, açık ve koyu temada okunur.

---

### Task 5: Kaydırmalı akış, latte barı ve menüler

**Files:**
- Create: `site/js/viewer.js`, `site/js/ui.js`, `site/js/main.js`
- Test: tarayıcı denetimleri (Adım 5-10). Saf mantık Task 2-3'te test edildi; bu görev yalnızca bağlantıları ekler.

**Interfaces:**
- Consumes: `Feed` (Task 3), `createRecord`, `completesByDwell`, `markCompleted` (Task 3), `renderCard`, `icon` (Task 4), `GOAL`, `createProgress`, `completeCard`, `recordAnswer` (Task 2), `createStore` (Task 2), `COURSES`, `COURSE_BY_CODE`, `loadAllCards` (Task 4).
- Produces (`viewer.js`): `DWELL_MS=2000`, `AHEAD=4`, `KEEP=12`, `createViewer({root, feed, handlers, onActive, onComplete, dwellMs}) → {start(), step(dir), destroy(), activeRecord, count}`. `handlers.onAnswer(record, isCorrect, ahead)` üçüncü argüman olarak önden yüklenmiş kart sayısını alır.
- Produces (`ui.js`): `createUI() → {feedEl, setProgress(p, {bump}), setFilterLabel(text), openFilter({current, options, onPick}), openMenu({progress, theme, flags, onTheme, onCopy, onReset}), showCopyFallback(text), celebrate(lattes), isCelebrating(), closeCelebration(), toast(text), showHint(), showLoading(), hideLoading(), showError(text, onRetry), showEmpty({title, text, onBack}), hideEmpty(), bind({onOpenFilter, onOpenMenu}), applyTheme(choice), paintSky()}`.
- Saklama anahtarları (`dep:` önekiyle): `progress`, `saved` (id dizisi), `flags` (`{id, at}` dizisi), `filter`, `theme`, `hintSeen`, `seen:<filtre>`, `current:<filtre>`.

- [ ] **Step 1: Görüntüleyiciyi yaz**

```js
// @file site/js/viewer.js
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
```

- [ ] **Step 2: Arayüz parçalarını yaz**

```js
// @file site/js/ui.js
// Arayüz parçaları: latte barı, filtre ve menü sayfaları, kutlama, bildirim, ilk kullanım ipucu,
// yükleme/hata/boş ekranları ve tema. Onay pencereleri sayfanın içindedir (alert/confirm kullanılmaz).
import { GOAL } from './progress.js';
import { icon } from './render.js';

const $ = (sel) => document.querySelector(sel);
const fmt = (n) => n.toLocaleString('tr-TR');
const make = (tag, className, text) => Object.assign(document.createElement(tag), { className, textContent: text ?? '' });

export function createUI() {
  const els = {
    feed: $('#feed'), latte: $('#latte'), bar: $('#latte-bar'), level: $('#latte-level'), count: $('#latte-count'), won: $('#latte-won-n'),
    filterBtn: $('#filter-btn'), filterLabel: $('#filter-label'), filterSheet: $('#filter-sheet'), filterList: $('#filter-list'),
    menuBtn: $('#menu-btn'), menuSheet: $('#menu-sheet'), stats: $('#stats'),
    flagsNote: $('#flags-note'), flagsList: $('#flags-list'), flagsText: $('#flags-text'), copyFlags: $('#copy-flags'), reset: $('#reset-btn'),
    loading: $('#loading'), error: $('#error'), errorText: $('#error-text'), retry: $('#retry-btn'),
    empty: $('#empty'), emptyTitle: $('#empty-title'), emptyText: $('#empty-text'), emptyBtn: $('#empty-btn'),
    celebrate: $('#celebrate'), celebrateText: $('#celebrate-text'), celebrateBtn: $('#celebrate-btn'), confetti: $('#confetti'),
    toast: $('#toast'), hint: $('#hint'), sky: $('#sky'),
  };
  let toastTimer = 0;
  let resetTimer = 0;

  for (const dlg of [els.filterSheet, els.menuSheet]) {
    dlg.addEventListener('click', (e) => {
      const r = dlg.getBoundingClientRect();
      const outside = e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom;
      if (outside || e.target.closest('[data-close]')) dlg.close();
    });
  }

  function closeCelebration() {
    els.celebrate.hidden = true;
    els.confetti.replaceChildren();
    els.feed.focus({ preventScroll: true });
  }
  els.celebrateBtn.addEventListener('click', closeCelebration);

  function disarmReset() {
    clearTimeout(resetTimer);
    resetTimer = 0;
    els.reset.textContent = 'İlerlemeyi sıfırla';
    els.reset.classList.remove('is-armed');
  }

  return {
    feedEl: els.feed,

    setProgress(p, { bump = false } = {}) {
      const ratio = p.filled / GOAL;
      els.bar.style.width = `${ratio * 100}%`;
      els.level.style.transform = `translateY(${(29 * (1 - ratio)).toFixed(2)}px)`;
      els.count.textContent = `${p.filled}/${GOAL}`;
      els.won.textContent = fmt(p.lattes);
      els.latte.setAttribute('aria-valuenow', String(p.filled));
      els.latte.setAttribute('aria-valuetext', `${GOAL} karttan ${p.filled} tanesi tamamlandı`);
      if (bump) {
        els.latte.classList.remove('is-bump');
        void els.latte.offsetWidth;
        els.latte.classList.add('is-bump');
      }
    },

    setFilterLabel(text) {
      els.filterLabel.textContent = text;
    },

    openFilter({ current, options, onPick }) {
      els.filterList.replaceChildren(...options.map((o) => {
        const btn = make('button', 'pick');
        btn.type = 'button';
        btn.setAttribute('role', 'radio');
        btn.setAttribute('aria-checked', String(o.value === current));
        btn.disabled = Boolean(o.disabled);
        const main = make('span', 'pick__main');
        main.append(make('span', 'pick__title', o.title));
        if (o.sub) main.append(make('span', 'pick__sub', o.sub));
        btn.append(main, make('span', 'pick__count', o.countText));
        btn.addEventListener('click', () => {
          els.filterSheet.close();
          onPick(o.value);
        });
        return btn;
      }));
      els.filterSheet.showModal();
    },

    openMenu({ progress, theme, flags, onTheme, onCopy, onReset }) {
      const stat = (n, label) => {
        const d = make('div', 'stat');
        d.append(make('span', 'stat__n', n), make('span', 'stat__label', label));
        return d;
      };
      els.stats.replaceChildren(
        stat(fmt(progress.doneToday), 'bugün tamamlanan kart'),
        stat(`${fmt(progress.lattes)} ☕`, 'kazanılan latte'),
        stat(fmt(progress.totalDone), 'toplam kart'),
        stat(`${fmt(progress.correct)} / ${fmt(progress.wrong)}`, 'doğru / yanlış'),
      );
      const choices = [...els.menuSheet.querySelectorAll('[data-theme-choice]')];
      for (const b of choices) {
        b.setAttribute('aria-checked', String(b.dataset.themeChoice === theme));
        b.onclick = () => {
          onTheme(b.dataset.themeChoice);
          for (const x of choices) x.setAttribute('aria-checked', String(x === b));
        };
      }
      els.flagsText.hidden = true;
      els.flagsNote.textContent = flags.length
        ? `${flags.length} kart işaretledin. Listeyi kopyalayıp gönderirsen kartlar düzeltilir.`
        : 'Henüz işaretlediğin kart yok. Bir kartta “Hatalı olabilir”e dokunursan burada görünür.';
      els.flagsList.replaceChildren(...flags.map((f) => {
        const li = document.createElement('li');
        li.append(`${f.label} `, make('code', '', f.id));
        return li;
      }));
      els.copyFlags.hidden = !flags.length;
      els.copyFlags.onclick = () => onCopy();
      disarmReset();
      els.reset.onclick = () => {
        if (!resetTimer) {
          resetTimer = setTimeout(disarmReset, 4000);
          els.reset.textContent = 'Emin misin? Evet, sıfırla';
          els.reset.classList.add('is-armed');
          return;
        }
        disarmReset();
        els.menuSheet.close();
        onReset();
      };
      els.menuSheet.showModal();
    },

    showCopyFallback(text) {
      els.flagsText.value = text;
      els.flagsText.hidden = false;
      els.flagsText.focus();
      els.flagsText.select();
    },

    celebrate(lattes) {
      els.celebrateText.textContent = `Şimdiye kadar ${fmt(lattes)} latte kazandın. Böyle devam! 💖`;
      const colors = ['var(--u-mane1)', 'var(--u-mane2)', 'var(--u-mane3)', 'var(--gold)', 'var(--accent)'];
      const frag = document.createDocumentFragment();
      for (let i = 0; i < 28; i++) {
        const bit = icon(i % 3 ? 'i-sparkle' : i % 2 ? 'i-heart' : 'i-star', 'confetti__bit');
        bit.style.setProperty('--x', `${Math.random() * 100}%`);
        bit.style.setProperty('--s', `${12 + Math.random() * 16}px`);
        bit.style.setProperty('--c', colors[i % colors.length]);
        bit.style.setProperty('--d', `${2.2 + Math.random() * 1.8}s`);
        bit.style.setProperty('--delay', `${Math.random() * 0.6}s`);
        bit.style.setProperty('--r', `${Math.round(Math.random() * 720 - 360)}deg`);
        frag.append(bit);
      }
      els.confetti.replaceChildren(frag);
      els.celebrate.hidden = false;
      els.celebrateBtn.focus();
    },

    isCelebrating: () => !els.celebrate.hidden,
    closeCelebration,

    toast(text) {
      clearTimeout(toastTimer);
      els.toast.textContent = text;
      els.toast.hidden = false;
      els.toast.classList.remove('is-in');
      void els.toast.offsetWidth;
      els.toast.classList.add('is-in');
      toastTimer = setTimeout(() => { els.toast.hidden = true; }, 2800);
    },

    showHint() {
      els.hint.hidden = false;
      const hide = () => { els.hint.hidden = true; };
      els.feed.addEventListener('scroll', hide, { once: true });
      setTimeout(hide, 7000);
    },

    showLoading() {
      els.error.hidden = true;
      els.loading.hidden = false;
    },
    hideLoading() {
      els.loading.hidden = true;
    },
    showError(text, onRetry) {
      els.loading.hidden = true;
      els.errorText.textContent = text;
      els.error.hidden = false;
      els.retry.onclick = () => {
        els.error.hidden = true;
        onRetry();
      };
    },
    showEmpty({ title, text, onBack }) {
      els.emptyTitle.textContent = title;
      els.emptyText.textContent = text;
      els.emptyBtn.onclick = onBack;
      els.empty.hidden = false;
    },
    hideEmpty() {
      els.empty.hidden = true;
    },

    bind({ onOpenFilter, onOpenMenu }) {
      els.filterBtn.addEventListener('click', onOpenFilter);
      els.menuBtn.addEventListener('click', onOpenMenu);
    },

    applyTheme(choice) {
      if (choice === 'light' || choice === 'dark') document.documentElement.dataset.theme = choice;
      else delete document.documentElement.dataset.theme;
    },

    paintSky() {
      const frag = document.createDocumentFragment();
      for (let i = 0; i < 16; i++) {
        const star = icon(i % 4 === 0 ? 'i-star' : 'i-sparkle', 'sky__star');
        star.style.setProperty('--x', `${Math.round(Math.random() * 96)}%`);
        star.style.setProperty('--y', `${Math.round(Math.random() * 96)}%`);
        star.style.setProperty('--s', `${8 + Math.round(Math.random() * 14)}px`);
        star.style.setProperty('--d', `${3 + Math.random() * 4}s`);
        star.style.setProperty('--delay', `${-Math.random() * 6}s`);
        frag.append(star);
      }
      els.sky.replaceChildren(frag);
    },
  };
}
```

- [ ] **Step 3: Giriş noktasını yaz**

```js
// @file site/js/main.js
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

function onComplete() {
  const result = completeCard(progress);
  progress = result.state;
  saveProgress();
  ui.setProgress(progress, { bump: true });
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
    store.set('hintSeen', true);
  }
}

ui.applyTheme(theme);
ui.paintSky();
ui.setProgress(progress);
ui.bind({ onOpenFilter: openFilter, onOpenMenu: openMenu });
load();
```

- [ ] **Step 4: Testleri ve örnek derlemeyi çalıştır**

Run: `npm test && npm run build:fixtures`
Expected: tüm testler PASS; iki örnek ders derlenir.

- [ ] **Step 5: Uygulamayı telefon boyutunda aç**

`preview_start` (`site`), `http://localhost:5173/` → `resize_window` preset `mobile`. Konsolu oku (`read_console_messages`, `onlyErrors: true`) → hata yok. Ekran görüntüsü: üst barda unicorn + "Dünyanın en güzel perfüzyonisti", filtre çipi "Tümü", boş latte bardağı, "0/50", "☕ 0"; ortada ilk kart; altta "Yukarı kaydır ✨" ipucu.

- [ ] **Step 6: Snap denetimi (Review Focus 1)**

`javascript_tool`:
```js
const feed = document.querySelector('#feed');
const s = document.querySelector('.slide');
const check = () => ({ slideEqualsFeed: Math.abs(s.clientHeight - feed.clientHeight) <= 1, aligned: Math.round(feed.scrollTop) % feed.clientHeight <= 1 });
feed.scrollTo({ top: feed.clientHeight * 2 });
await new Promise((r) => setTimeout(r, 800));
check();
```
Expected: `{ slideEqualsFeed: true, aligned: true }`. Ardından `resize_window` 320×568 ve aynı kodu yeniden çalıştır → yine `true/true`.

- [ ] **Step 7: Tamamlanma ve hızlı kaydırma (Review Focus 4)**

`javascript_tool`:
```js
const feed = document.querySelector('#feed');
const count = () => document.querySelector('#latte-count').textContent;
const before = count();
for (let i = 1; i <= 6; i++) { feed.scrollTo({ top: feed.clientHeight * i }); await new Promise((r) => setTimeout(r, 150)); }
const afterFast = count();
const back = feed.scrollTop;
await new Promise((r) => setTimeout(r, 2600));
({ before, afterFast, afterWait: count(), activeType: document.querySelectorAll('.slide')[Math.round(back / feed.clientHeight)].querySelector('.card')?.dataset.type });
```
Expected: `afterFast === before`. `activeType` fact/remember/compare ise `afterWait` 1 artmış olmalı; değilse kartta şık seç veya "Cevabı gör"e bas ve sayacın 1 arttığını gör. Sonra bir önceki karta geri kaydırıp 2,5 sn bekle → sayaç değişmez (aynı kart iki kez sayılmaz).

- [ ] **Step 8: Kutlama, kalıcılık ve eksik dosya (Review Focus 5)**

1. `javascript_tool`: `localStorage.setItem('dep:progress', JSON.stringify({ filled: 49, lattes: 2, totalDone: 149, correct: 10, wrong: 3, day: '2000-01-01', doneToday: 0 })); location.reload();` → 2 sn bekle, gerekirse bir bilgi kartına kaydır ya da bir şık seç. Beklenen: "Gofrikli latteyi kazandın! ☕" kutlaması, "Şimdiye kadar 3 latte kazandın", bar 0/50, "☕ 3". "Devam et 💖" kapatır.
2. Sayfayı yenile → "☕ 3" ve bar korunur.
3. Bash: `mv site/data/PER207.json site/data/PER207.json.bak` → sayfayı yenile → bildirim "PER207 kartları şu an açılamadı; diğer dersler hazır."; filtre sayfasında PER207 soluk ve seçilemez. Ardından `mv site/data/PER207.json.bak site/data/PER207.json`.

- [ ] **Step 9: Filtre, kaydet, işaretle, menü**

1. Bir kartta "Kaydet" → bildirim; filtre → "Kaydettiklerim" → yalnızca o kart gelir. "Kaydet"i kaldırınca filtre tekrar seçilirse boş ekran "Burada henüz kart yok" + "Tüm kartlara dön".
2. Bir kartta "Hatalı olabilir" → menüde listede görünür; "Listeyi kopyala" → "Liste kopyalandı 📋" ya da seçili metin kutusu.
3. Menüde "Yıldızlı gece" → koyu tema; sayfa yenilenince korunur; "Otomatik"e dön.
4. "İlerlemeyi sıfırla" → düğme "Emin misin? Evet, sıfırla" olur; ikinci dokunuşta bar ve istatistikler sıfırlanır.
5. Masaüstü boyutunda ↓ / ↑ tuşları kartlar arasında geçer.

- [ ] **Step 10: Koyu tema ekran görüntüsü** — `resize_window` `colorScheme: 'dark'`, mobil boyut; üst bar, kart ve latte barı okunur. Sonra `resize_window` preset `desktop`.

- [ ] **Step 11: Kontrol noktası** — `npm test` yeşil; Adım 5-10 beklenen sonuçları verdi; konsolda hata yok.

---

### Task 6: İçerik rehberi ve pilot

**Files:**
- Create: `docs/content-guide.md`
- Create: `content/<ilk hazır ders>/NN-konu.json` (pilot, 15-20 kart)

**Interfaces:**
- Consumes: `research/<DERS>.md` (Task 0), `scripts/build-data.mjs` (Task 1), çalışan uygulama (Task 5).
- Produces: Task 7 ve 8 ajanlarının uyacağı rehber; pilotla sınanmış kart biçimi.

- [ ] **Step 1: Rehberi yaz**

````markdown
<!-- @file docs/content-guide.md -->
# Kart Yazım ve Doğrulama Rehberi

## 1. Okuyucu
İstanbul Gelişim Üniversitesi Perfüzyon (lisans) 2. sınıf öğrencisi. Kartlar sınav hazırlığı içindir ve telefonda Reels gibi tek tek okunur. Hocalar sınavda sık sık "X terimi ne demektir?" diye soruyor; terim kartları bu yüzden en kalabalık grup. Her kart kendi başına anlaşılır ve tek bir fikir taşır.

## 2. Doğruluk kuralları (en önemlisi)
1. Kartlara yalnızca `research/<DERS>.md` (ve varsa `research/<DERS>-2.md` gibi ek dosyalar) içinde kaynağı gösterilmiş bilgi girer.
2. Sayılar, dozlar, eşikler, sıcaklıklar, süreler ve sınıflamalar dosyadakiyle birebir aynı yazılır; birim her zaman yazılır.
3. Dosyada "(doğrulanamadı)" işaretli bilgi kullanılmaz.
4. Kaynaklar arasında fark varsa en yaygın kabul gören değer yazılır ve "genellikle", "yaygın kabul gören", "kılavuzlara göre" gibi bir ifadeyle yumuşatılır. Kesin olmayan şey kesinmiş gibi yazılmaz.
5. Merkezden merkeze değişen uygulamalar "merkeze göre değişebilir" diye belirtilir.
6. Emin değilsen kartı yazma.
7. `source` alanı: sayı, doz, eşik, sınıflama ya da kılavuz önerisi içeren her kartta kısa kaynak adı yazılır (örn. "EACTS/EACTA/EBCP 2024", "ELSO 2021", "CDC 2008", "WHO 2016", "StatPearls", "Gravlee"). En fazla 80 karakter, URL yok.

## 3. Biçim
Dosya: `content/<DERS>/NN-konu-slug-a.json` (terim ve karşılaştırma yazarı) veya `…-b.json` (diğer türlerin yazarı). `NN` ve slug sana verilen konu listesinden alınır.

```json
{
  "topic": "Antikoagülasyon",
  "cards": [
    { "type": "term", "importance": 3, "term": "Heparin direnci", "en": "Heparin resistance", "definition": "…", "source": "…" }
  ]
}
```

- `topic` sana verilen konu adıdır (en fazla 48 karakter), ekranda kartın üstünde görünür.
- Her kartta `type` ve `importance` zorunludur. `id` ve `course` yazılmaz; derleme ekler.

| type | alanlar ve karakter sınırları |
|---|---|
| term | term ≤60 · en ≤80 (isteğe bağlı) · definition ≤320 · origin ≤120 (isteğe bağlı) |
| fact | title ≤70 · body ≤320 |
| remember | title ≤70 · body ≤320 |
| flip | question ≤200 · answer ≤320 |
| mcq | question ≤200 · options tam 4, her biri ≤90 · correct 0-3 · explanation ≤240 |
| tf | statement ≤220 · isTrue true/false · explanation ≤240 |
| compare | title ≤70 (isteğe bağlı) · left / right: { title ≤40, points 2-4 madde, her biri ≤90 } |

- Kalın yazı `**…**` ile, kart başına en fazla 1-3 anahtar kelime ya da sayı. İşaretler çift olmalı.
- Kontrol: `node scripts/build-data.mjs <DERS>` kendi dosyaların için hatasız olmalı.

## 4. Önem derecesi
- **3**: sınavda çok çıkar, temel tanım, hayati ya da güvenlik açısından kritik, sık karıştırılan.
- **2**: önemli ve sık kullanılan bilgi.
- **1**: destekleyici ayrıntı, tarihçe ayrıntısı.
- Kabaca %30 önem 3, %50 önem 2, %20 önem 1.

## 5. Türlere göre yazım
**term**
- Sözlükteki her önemli terim için bir kart. `definition`, "X terimi ne demektir?" sorusunun sınavda tam puan alacak cevabıdır.
- Tanım terimi tekrar etmeden başlar ("Kanın kristaloid veya kolloid sıvılarla seyreltilmesi."), 1-2 cümledir; gerekirse sonuna kısa bağlam eklenir.
- `origin` yalnızca kök gerçekten öğreticiyse ve doğruysa ("hemo = kan, dilüsyon = seyreltme").
- `en`: İngilizce karşılık; kısaltma varsa birlikte ("Activated clotting time (ACT)").
- Kartların yarısı "Bu terim ne demek?" diye gösterilir; `term` alanında açıklama olmaz.

**fact**
- `title` kısa ve bilgi verici ("Roller pompada oklüzyon"). `body` 1-3 cümle, tek fikir.

**remember**
- Yalnızca gerçekten kritik bilgiler: güvenlik kuralları, klasik sınav tuzakları, mutlaka ezberlenecek sayılar.

**flip**
- Sınavda sorulabilecek açık uçlu soru; `answer` kısa, net ve kendi başına anlaşılır.

**mcq**
- Tek doğru cevap; 3 çeldirici aynı kategoriden ve makul (örn. dört farklı kardiyopleji solüsyonu).
- "Hepsi", "Hiçbiri", "A ve B", "Yukarıdakilerin…" yasak: şıklar ekranda karıştırılır.
- Olumsuz soru ("hangisi … değildir?") az kullanılır ve olumsuz kelime kalın yazılır: `**değildir**`.
- Şıklar benzer uzunlukta olur; doğru şık hep en uzun olmasın. `correct` değerleri 0-3 arasında dengeli dağılsın.
- `explanation`: neden doğru; yer varsa en çekici çeldiricinin neden yanlış olduğu.

**tf**
- Yaklaşık yarısı doğru, yarısı yanlış.
- Yanlış ifade tek bir anahtar bilgi değiştirilerek kurulur ve kesinlikle yanlıştır; `explanation` doğrusunu söyler.
- "Her zaman", "asla" gibi kelimelerle tuzak kurma; bilgiyi sına.

**compare**
- Sık karıştırılan iki kavram (araştırma dosyasındaki "Sık karıştırılan kavramlar" bölümü).
- İki taraftaki maddeler aynı sırada aynı özelliği karşılaştırır (1. madde mekanizma, 2. madde kullanım alanı …).

## 6. Kapsam ve dağılım (ders başına ~350 kart)
| tür | hedef |
|---|---|
| term | ~140 |
| fact | ~63 |
| mcq | ~52 |
| flip | ~35 |
| tf | ~28 |
| remember | ~18 |
| compare | ~14 |

- Araştırma dosyasındaki her konu kapsanır; konu başına kart sayısı konunun ağırlığıyla orantılıdır.
- "Kritik / sınavda çıkabilecek bilgiler" listesindeki her madde en az bir kartta yer alır (tercihen bir bilgi ve bir soru kartında).
- Aynı bilgi en fazla iki kez, farklı türlerde kullanılır; aynı soru iki kez yazılmaz.

## 7. Dil
- Doğru Türkçe tıp terimleri ve eksiksiz Türkçe karakterler (ı, İ, ş, ğ, ü, ö, ç).
- Kısaltmadan sonra kesme işareti: "KPB'de", "ACT'nin", "ECMO'da".
- Kısaltma ilk kullanıldığı kartta açılır ya da `en` alanında verilir.
- Hoca adı kullanılmaz; tarihçe kartlarında bilim insanı adları kullanılabilir.
- Hasta tedavisi tavsiyesi gibi değil, ders bilgisi gibi yazılır.

## 8. Doğrulama turu
Her kart için:
1. Bilgi araştırma dosyasıyla karşılaştırılır. Sayı, doz, eşik, sınıflama ya da şüpheli her iddia güvenilir bir web kaynağında (kılavuz, ders kitabı özeti, PubMed/PMC, StatPearls, resmî kurum) ayrıca doğrulanır.
2. Test kartında savunulabilir tek doğru cevap vardır; çeldiriciler kesin yanlıştır. Doğru/yanlış ifadesi tek anlamlıdır.
3. Ders kapsamına ve 2. sınıf düzeyine uygundur.
4. Türkçe anlaşılır, yazım hatası yok, terim doğru.
5. Yanlış olan düzeltilir; doğrulanamayan silinir. Her değişiklik `content/<DERS>/_dogrulama-<a|b>.md` dosyasına yazılır: dosya ve kart numarası, eski → yeni (ya da "silindi"), neden, kaynak URL.
6. Kritik bilgiler listesinde kartı olmayan madde varsa yeni kart eklenir ve aynı kayda yazılır.
7. Sonunda `node scripts/build-data.mjs <DERS>` hatasız çalışır.
````

- [ ] **Step 2: Pilot kartları yaz** — İlk tamamlanan araştırma dosyasından tek bir konu seç ve rehbere uyarak 15-20 kart yaz (her türden en az iki). Dosya: `content/<DERS>/NN-slug-a.json` ve `-b.json`.

- [ ] **Step 3: Pilotu derle ve göster**

Run: `node scripts/build-data.mjs <DERS>`
Expected: `✓ <DERS>: N kart`, hata yok (dağılım ve "en az 300" uyarıları pilotta beklenir).
Uygulamada filtreden o dersi seç; kartları kaydırarak oku. Rehberde eksik ya da belirsiz kalan kural varsa (ör. kart ekrana sığmıyor, kaynak alanı fazla uzun) rehberi düzelt.

- [ ] **Step 4: Kontrol noktası** — Pilot kartlar hatasız derleniyor ve telefonda okunur; rehber son hâlinde.

---

### Task 7: Kart yazımı (6 ders, ders başına iki yazar)

**Files:**
- Create: `content/<DERS>/NN-slug-a.json` (terim + karşılaştırma), `content/<DERS>/NN-slug-b.json` (hap bilgi, test, soru, doğru/yanlış, bunu unutma)

**Interfaces:**
- Consumes: `research/<DERS>.md` (+ ek parçalar), `docs/content-guide.md`, `scripts/build-data.mjs`.
- Produces: ders başına ~350 kart; `node scripts/build-data.mjs <DERS>` hatasız.

Her ders, araştırma dosyası tamamlanır tamamlanmaz başlar; dersler birbirini beklemez.

- [ ] **Step 1: Konu listesini çıkar** — `research/<DERS>.md` içindeki "## 1. Konu listesi" bölümünden `NN | slug | topic` tablosu oluştur (topic ≤ 48 karakter, slug ASCII küçük harf ve tire). Bu tablo iki yazara da aynen verilir; böylece konu adları tutarlı olur.

- [ ] **Step 2: İki yazar ajanını başlat** (her ders için, arka planda, `general-purpose`). İstem şablonu (`{…}` alanlarını doldur):

```text
Sen perfüzyon eğitimi için kart yazan titiz bir içerik yazarısın. Ders: {KOD} — {AD}.
Çalışma klasörü: {PROJE_YOLU}

1. Önce docs/content-guide.md dosyasını baştan sona oku ve kurallarına harfiyen uy.
2. Tek bilgi kaynağın: research/{KOD}.md{EK_DOSYALAR}. Bu dosyalarda olmayan bilgiyi karta yazma; web'de arama yapma.
3. Senin payın: {PAY}. Diğer türleri başka bir yazar yazıyor; onun dosyalarına (…-{DİĞER_HARF}.json) dokunma.
4. Konu listesi (aynen kullan; dosya adı content/{KOD}/NN-slug-{HARF}.json, "topic" alanı tablodaki konu adı):
{KONU_TABLOSU}
5. Hedef sayılar: {HEDEFLER}. Konu başına kart sayısı konunun ağırlığıyla orantılı olsun; araştırma dosyasındaki "Kritik / sınavda çıkabilecek bilgiler" ve {HARF_A_ISE: "Sözlük"; HARF_B_ISE: "Önemli sayısal değerler"} bölümlerindeki her maddeyi kapsa.
6. Dosyaları konu konu yaz (her dosya 10-40 kart). Her birkaç dosyadan sonra çalıştır: node scripts/build-data.mjs {KOD}
   Yalnızca kendi dosyalarındaki hataları düzelt; diğer yazarın dosyalarındaki hataları ve dağılım uyarılarını yok say.
7. Bitince bana 10 satırı geçmeyen bir özet dön: yazdığın dosyalar, türlere göre kart sayıları, kapsayamadığın konu ya da madde varsa nedeni.
```

`{PAY}` ve `{HEDEFLER}`:
- Yazar A: `yalnızca "term" ve "compare" kartları` — `term ~140, compare ~14`.
- Yazar B: `yalnızca "fact", "mcq", "flip", "tf", "remember" kartları` — `fact ~63, mcq ~52, flip ~35, tf ~28, remember ~18`.

- [ ] **Step 3: Her yazar bitince derle**

Run: `node scripts/build-data.mjs <DERS>`
Expected: `✓ <DERS>: ~350 kart`, hata yok. Dağılım uyarısı ±5 puanı aşıyorsa eksik türü tamamlamak için ilgili yazarı `SendMessage` ile sürdür.

- [ ] **Step 4: Kontrol noktası** — 6 dersin hepsi hatasız derleniyor, her biri ≥ 300 kart.

---

### Task 8: Kart doğrulama (6 ders, ders başına iki doğrulayıcı)

**Files:**
- Modify: `content/<DERS>/*-a.json`, `content/<DERS>/*-b.json`
- Create: `content/<DERS>/_dogrulama-a.md`, `content/<DERS>/_dogrulama-b.md` (`_` ile başladığı için derlemeye girmez)

**Interfaces:**
- Consumes: Task 7 çıktıları, `research/<DERS>.md`, `docs/content-guide.md` §8.
- Produces: doğrulanmış kartlar ve değişiklik kayıtları.

- [ ] **Step 1: Doğrulayıcı ajanları başlat** (her ders için iki tane, yazarlardan bağımsız yeni ajanlar). İstem şablonu:

```text
Sen bağımsız ve şüpheci bir tıp eğitimi editörüsün. Görevin, başka birinin yazdığı perfüzyon çalışma kartlarını doğrulamak. Ders: {KOD} — {AD}. Çalışma klasörü: {PROJE_YOLU}

1. docs/content-guide.md dosyasını oku; özellikle §2 (doğruluk) ve §8 (doğrulama turu) senin talimatındır.
2. İnceleyeceğin dosyalar: content/{KOD}/*-{HARF}.json. Diğer dosyalara dokunma.
3. Her kartı tek tek kontrol et:
   a) Bilgi research/{KOD}.md{EK_DOSYALAR} ile uyumlu mu?
   b) Her sayı, doz, eşik, sıcaklık, süre, sınıflama ve şüpheli iddiayı güvenilir bir web kaynağında (kılavuz, ders kitabı özeti, PubMed/PMC, StatPearls, resmî kurum) ayrıca doğrula.
   c) Test kartında tek savunulabilir doğru cevap var mı, çeldiriciler kesin yanlış mı? Doğru/yanlış ifadesi tek anlamlı mı?
   d) Türkçe anlaşılır ve terim doğru mu? Ders kapsamına ve 2. sınıf düzeyine uygun mu?
4. Yanlışı düzelt; doğrulayamadığını sil. Şüphede kalırsan sil.
5. Her değişikliği content/{KOD}/_dogrulama-{HARF}.md dosyasına yaz: dosya ve kart numarası, eski → yeni (ya da "silindi"), neden, kaynak URL.
6. Araştırma dosyasındaki kritik bilgilerden kartı olmayan varsa yeni kart ekle ve kayda yaz.
7. Bitince çalıştır: node scripts/build-data.mjs {KOD} — kendi dosyalarında hata kalmamalı.
8. Bana 10 satırı geçmeyen özet dön: incelenen kart sayısı, düzeltilen, silinen, eklenen, en önemli 3 düzeltme.
```

- [ ] **Step 2: Kayıtları gözden geçir** — Her `_dogrulama-*.md` dosyasında silinen ve düzeltilen kartları oku. Aynı tür hata çok tekrarlıyorsa (ör. hep aynı eşik değeri yanlış) diğer derslerde de aynı kalıbı ara ve düzelt.

- [ ] **Step 3: Tüm verileri derle**

Run: `npm run build:data`
Expected: 6 satırın hepsi `✓`, her ders ≥ 300 kart, hata yok. Silmeler yüzünden bir ders 300'ün altına düştüyse ilgili yazarı sürdürerek eksik konulardan kart ekle ve o kartları aynı doğrulayıcıya doğrulat.

- [ ] **Step 4: Kontrol noktası** — Tüm kartlar doğrulama turundan geçti; derleme hatasız.

---

### Task 9: Son kontrol ve yayın

**Files:**
- Create: `scripts/build-artifact.mjs`, `tests/build-artifact.test.mjs`
- Create (üretilen): `dist/artifact.html`

**Interfaces:**
- Consumes: `site/` (Task 4-5), `site/data/*.json` (Task 8).
- Produces: `toArtifactHtml(html): string`; yayınlanmış Artifact linki.

- [ ] **Step 1: Artifact dönüştürücü testini yaz**

```js
// @file tests/build-artifact.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { toArtifactHtml } from '../scripts/build-artifact.mjs';

const page = `<!doctype html>
<html lang="tr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>Dünyanın en güzel perfüzyonisti</title>
<link rel="stylesheet" href="css/styles.css">
<script type="module" src="js/main.js"></script>
</head>
<body>
<header class="topbar">x</header>
</body>
</html>
`;

test('belge iskeleti çıkarılır, başlık en üstte kalır, içerik korunur', () => {
  const out = toArtifactHtml(page);
  assert.ok(out.startsWith('<title>Dünyanın en güzel perfüzyonisti</title>'));
  assert.doesNotMatch(out, /<!doctype|<html|<head>|<\/head>|<body|<\/body>|<\/html>|<meta charset|name="viewport"/i);
  assert.ok(out.includes('<header class="topbar">x</header>'));
  assert.ok(out.includes('<link rel="stylesheet" href="css/styles.css">'));
  assert.ok(out.includes('<script type="module" src="js/main.js"></script>'));
});
```

- [ ] **Step 2: Testi çalıştır, başarısız olduğunu gör**

Run: `npm test`
Expected: FAIL — `Cannot find module '…/scripts/build-artifact.mjs'`

- [ ] **Step 3: Dönüştürücüyü yaz**

```js
// @file scripts/build-artifact.mjs
// site/index.html'den claude.ai Artifact sürümünü üretir. Artifact yayınlanırken sayfa kendi iskeletine sarıldığı için
// doctype, html/head/body etiketleri ve charset/viewport meta etiketleri çıkarılır; geri kalan her şey korunur.
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export function toArtifactHtml(html) {
  return `${html
    .replace(/<!doctype html>\s*/i, '')
    .replace(/<\/?(html|head|body)(\s[^>]*)?>\s*/gi, '')
    .replace(/<meta\s+(charset|name="viewport")[^>]*>\s*/gi, '')
    .trim()}\n`;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const src = await readFile('site/index.html', 'utf8');
  await mkdir('dist', { recursive: true });
  await writeFile('dist/artifact.html', toArtifactHtml(src));
  console.log('dist/artifact.html yazıldı');
}
```

- [ ] **Step 4: Testi çalıştır, geçtiğini gör**

Run: `npm test`
Expected: PASS — tüm testler geçer.

- [ ] **Step 5: Gerçek verilerle son tarayıcı kontrolü**
1. Run: `npm run build:data` → 6 ders `✓`.
2. Vitrinde (`/gallery.html`) 320×568'de taşma denetimi (Task 4 Adım 10.6) gerçek en uzun kartlarla tekrar → `true`. Taşma varsa ilgili kartı kısalt ya da CSS'i düzelt.
3. Uygulamada mobil boyutta: açılış 2 sn içinde, 10 kart kaydırma akıcı, latte barı dolar, filtre sayfasında 6 ders ve sayılar görünür, konsolda hata yok.

- [ ] **Step 6: Artifact'ı üret ve yayınla**

Run: `node scripts/build-artifact.mjs` → `dist/artifact.html yazıldı`.
`Artifact` aracıyla yayınla: `file_path: dist/artifact.html`, `icon: "cards"`, `description: "Perfüzyon 2. sınıf dersleri için Reels gibi kaydırılan hap bilgi, terim ve test kartları; 50 kartta bir Gofrikli latte."`, `files`:
`css/styles.css → site/css/styles.css`; `js/main.js, js/data.js, js/feed.js, js/progress.js, js/store.js, js/cardstate.js, js/text.js, js/render.js, js/viewer.js, js/ui.js → site/js/…`; `data/PER141.json … data/PER247.json → site/data/…`.

- [ ] **Step 7: Yayını doğrula** — Linki uygulama içi tarayıcıda aç; kartlar yükleniyor, kaydırma ve latte barı çalışıyor. Modül betikleri ya da veri dosyaları engellenirse (CSP) betikleri tek bir satır içi `<script type="module">` dosyasında birleştir ve yeniden yayınla.

- [ ] **Step 8: Teslim** — Kullanıcıya linki, nasıl paylaşılacağını ve claude.ai dışında herkese açık bir adreste (GitHub Pages, Netlify vb.) yayınlama seçeneğini anlat; o adım yalnızca kullanıcının onayıyla yapılır.
