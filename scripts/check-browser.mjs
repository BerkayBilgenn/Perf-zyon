// İsteğe bağlı tarayıcı doğrulaması. Yerel sunucu açık olmalı; Playwright bu betiğin test aracıdır.
// PLAYWRIGHT_MODULE bir kurulu Playwright modülünün yoluna ayarlanabilir.
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const { chromium, webkit } = await import(process.env.PLAYWRIGHT_MODULE ?? 'playwright');
const base = process.env.PREVIEW_URL ?? 'http://127.0.0.1:5173';
const codes = ['PER141', 'PER207', 'PER241', 'PER243', 'PER245', 'PER247'];
const byCourse = new Map(await Promise.all(codes.map(async (code) => [code,
  JSON.parse(await readFile(new URL(`../site/data/${code}.json`, import.meta.url), 'utf8')),
])));

for (const engine of [chromium, webkit]) {
  const browser = await engine.launch({ headless: true });
  try {
    for (const code of codes) {
      const context = await browser.newContext({ viewport: { width: 320, height: 568 }, reducedMotion: 'reduce' });
      const page = await context.newPage();
      const errors = [];
      page.on('pageerror', (e) => errors.push(e.message));
      await context.addInitScript(() => localStorage.setItem('dep:hintSeen', 'true'));
      await page.goto(base);
      await page.waitForSelector('.card');
      await page.locator('#filter-btn').click();
      await page.locator('#filter-list button').filter({ hasText: code }).click();
      await page.waitForFunction((code) => JSON.parse(localStorage.getItem(`dep:record:${code}`))?.id, code);
      const byId = new Map(byCourse.get(code).map((c) => [c.id, c]));
      let answered = 0;
      let shown = 0;
      for (let i = 0; i < 100 && (shown < 20 || answered < 5); i++) {
        const slide = page.locator(`.slide[data-index="${i}"]`);
        await slide.locator('.card').waitFor();
        const rec = await page.evaluate((code) => JSON.parse(localStorage.getItem(`dep:record:${code}`)), code);
        const card = byId.get(rec.id);
        assert.ok(card, `${code}: doğru dersin kartı`);
        if (card.type === 'mcq') {
          await slide.locator('.opt').nth(rec.optionOrder.indexOf(card.correct)).click();
          answered++;
        } else if (card.type === 'tf') {
          await slide.locator(`.opt[data-value="${card.isTrue}"]`).click();
          answered++;
        } else if (await slide.locator('.reveal-btn:visible').count()) {
          await slide.locator('.reveal-btn').click();
        }
        shown++;
        if (await page.locator('#celebrate:visible').count()) await page.locator('#celebrate-btn').click();
        if (shown >= 20 && answered >= 5) break;
        await page.keyboard.press('ArrowDown');
        await page.waitForFunction(([index, code, previousId]) => {
          const root = document.querySelector('#feed');
          return Math.abs(root.scrollTop - index * root.clientHeight) < 2
            && JSON.parse(localStorage.getItem(`dep:record:${code}`))?.id !== previousId
            && document.querySelector(`.slide[data-index="${index}"] .card`);
        }, [i + 1, code, rec.id]);
      }
      assert.ok(shown >= 20 && answered >= 5, `${code}: en az 20 kart ve 5 test`);
      assert.deepEqual(errors, []);
      console.log(`✓ ${engine.name()} ${code}: ${shown} kart, ${answered} test, konsol hatası yok`);
      await context.close();
    }

    // Gerçek MCQ, doğru cevap sonrası yeniden yüklemede aynı sırayı ve puanı korur.
    const context = await browser.newContext({ viewport: { width: 320, height: 568 }, reducedMotion: 'reduce' });
    const page = await context.newPage();
    const first = byCourse.get('PER207').find((c) => c.type === 'mcq');
    await context.addInitScript((id) => {
      if (!localStorage.getItem('dep:record:PER207')) {
        localStorage.setItem('dep:filter', JSON.stringify('PER207'));
        localStorage.setItem('dep:current:PER207', JSON.stringify(id));
      }
      localStorage.setItem('dep:hintSeen', 'true');
    }, first.id);
    await page.goto(base);
    await page.waitForSelector('.options');
    const record = await page.evaluate(() => JSON.parse(localStorage.getItem('dep:record:PER207')));
    await page.locator('.slide').first().locator('.opt').nth(record.optionOrder.indexOf(first.correct)).click();
    const progress = await page.evaluate(() => JSON.parse(localStorage.getItem('dep:progress')));
    assert.equal(progress.points, 2);
    assert.equal(progress.correct, 1);
    const options = await page.locator('.slide').first().locator('.opt').allTextContents();
    await page.reload();
    await page.waitForSelector('.options');
    assert.deepEqual(await page.locator('.slide').first().locator('.opt').allTextContents(), options);
    assert.equal(await page.locator('.slide').first().locator('.opt:disabled').count(), 4);
    assert.deepEqual(await page.evaluate(() => JSON.parse(localStorage.getItem('dep:progress'))), progress);

    // Uzun ders etiketi ve büyüyen latte sayısı 320 px'de çakışmaz.
    await page.evaluate(() => {
      document.querySelector('#filter-label').textContent = 'Ekstrakorporeal Destek';
      document.querySelector('#latte-count').textContent = '27/50';
      document.querySelector('#latte-won-n').textContent = '123';
    });
    assert.equal(await page.evaluate(() => {
      const count = document.querySelector('#latte-count').getBoundingClientRect();
      const badge = document.querySelector('.latte__won').getBoundingClientRect();
      return count.right <= badge.left && badge.right <= innerWidth;
    }), true);

    await page.locator('#menu-btn').click();
    await page.locator('[data-theme-choice="dark"]').click();
    assert.equal(await page.locator('meta[name="theme-color"]').getAttribute('content'), '#1a0c29');
    await page.locator('[data-theme-choice="system"]').click();
    await page.emulateMedia({ colorScheme: 'light' });
    await page.waitForFunction(() => document.querySelector('meta[name="theme-color"]').content === '#fff0f6');
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.waitForFunction(() => document.querySelector('meta[name="theme-color"]').content === '#1a0c29');
    await page.keyboard.press('Escape');

    // Şema sınırları içindeki uzun soruda cevap başlangıcı kartın içinde görünür.
    await page.evaluate(async () => {
      const { renderCard } = await import('/js/render.js');
      const { createRecord } = await import('/js/cardstate.js');
      const card = {
        id: 'probe', course: 'PER241', topic: 'Konjenital ve pediatrik hastalarda çalışma', type: 'flip', importance: 3,
        question: 'Soru uzunluğu ve küçük ekranlarda cevapların görünürlüğünü değerlendiren bir deneme sorusu. '.repeat(2),
        answer: 'Cevabın başlangıcı görünür olmalı. '.repeat(9), source: 'Kaynak adı',
      };
      document.querySelector('.slide').replaceChildren(renderCard(createRecord({ card, key: 'probe', variant: null }), {
        isSaved: () => false, isFlagged: () => false, onReveal: () => {},
      }));
    });
    await page.locator('.slide').first().locator('.reveal-btn').click();
    await page.waitForFunction(() => {
      const answer = document.querySelector('.answer').getBoundingClientRect();
      const card = document.querySelector('.card').getBoundingClientRect();
      return answer.top >= card.top && answer.top < card.bottom - 40;
    });
    console.log(`✓ ${engine.name()}: tekrar puan yok, şık sırası korunuyor, 320 px düzen, otomatik tema ve uzun cevap görünürlüğü`);
    await context.close();

    // Önceki slaytta kalan klavye odağı, görünür kartın kaydını ezemez.
    const keyboardContext = await browser.newContext({ viewport: { width: 320, height: 568 }, reducedMotion: 'reduce' });
    const pair = [first, byCourse.get('PER207').find((c) => c.type === 'fact')];
    await keyboardContext.route('**/data/PER207.json', (route) => route.fulfill({ json: pair }));
    await keyboardContext.addInitScript((id) => {
      localStorage.setItem('dep:hintSeen', 'true');
      if (!localStorage.getItem('dep:record:PER207')) {
        localStorage.setItem('dep:filter', JSON.stringify('PER207'));
        localStorage.setItem('dep:current:PER207', JSON.stringify(id));
      }
    }, first.id);
    const keyboardPage = await keyboardContext.newPage();
    await keyboardPage.goto(base);
    await keyboardPage.waitForSelector('.options');
    const previous = await keyboardPage.evaluate(() => JSON.parse(localStorage.getItem('dep:record:PER207')));
    await keyboardPage.locator('.slide').first().locator('.opt').nth(previous.optionOrder.indexOf(first.correct)).focus();
    await keyboardPage.keyboard.press('ArrowDown');
    await keyboardPage.waitForFunction(() => JSON.parse(localStorage.getItem('dep:progress'))?.totalDone === 1);
    await keyboardPage.keyboard.press('Space');
    await keyboardPage.waitForFunction(() => JSON.parse(localStorage.getItem('dep:progress'))?.totalDone === 2);
    const after = await keyboardPage.evaluate(() => ({
      current: JSON.parse(localStorage.getItem('dep:current:PER207')),
      record: JSON.parse(localStorage.getItem('dep:record:PER207')),
      progress: JSON.parse(localStorage.getItem('dep:progress')),
    }));
    assert.equal(after.record.id, after.current);
    assert.equal(after.record.completed, true);
    await keyboardPage.reload();
    await keyboardPage.waitForSelector('.card');
    await keyboardPage.waitForTimeout(2200); // Okuma puanı süresinin tamamını kapsar.
    assert.deepEqual(await keyboardPage.evaluate(() => JSON.parse(localStorage.getItem('dep:progress'))), after.progress);
    console.log(`✓ ${engine.name()}: eski slayttaki klavye odağı görünür kartın kaydını bozamıyor`);
    await keyboardContext.close();
  } finally {
    await browser.close();
  }
}
