// Arayüz parçaları: latte barı, filtre ve menü sayfaları, kutlama, bildirim, ilk kullanım ipucu,
// yükleme/hata/boş ekranları ve tema. Onay pencereleri sayfanın içindedir (alert/confirm kullanılmaz).
import { GOAL } from './progress.js';
import { icon } from './render.js';

const $ = (sel) => document.querySelector(sel);
const fmt = (n) => n.toLocaleString('tr-TR');
const make = (tag, className, text) => Object.assign(document.createElement(tag), { className, textContent: text ?? '' });

export function createUI() {
  const els = {
    feed: $('#feed'), latte: $('#latte'), bar: $('#latte-bar'), level: $('#latte-level'), count: $('#latte-count'), won: $('#latte-won-n'), delta: $('#latte-delta'),
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
  let copyTimer = 0;

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

    setProgress(p, { bump = false, delta = 0 } = {}) {
      const ratio = p.filled / GOAL;
      els.bar.style.width = `${ratio * 100}%`;
      els.level.style.transform = `translateY(${(29 * (1 - ratio)).toFixed(2)}px)`;
      els.count.textContent = `${p.filled}/${GOAL}`;
      els.won.textContent = fmt(p.lattes);
      els.latte.setAttribute('aria-valuenow', String(p.filled));
      els.latte.setAttribute('aria-valuetext', `${GOAL} puandan ${p.filled} puan toplandı`);
      if (bump) {
        els.latte.classList.remove('is-bump');
        void els.latte.offsetWidth;
        els.latte.classList.add('is-bump');
      }
      if (delta) {
        els.delta.textContent = delta > 0 ? `+${delta}` : `−${Math.abs(delta)}`;
        els.delta.classList.toggle('is-minus', delta < 0);
        els.delta.classList.remove('is-show');
        void els.delta.offsetWidth;
        els.delta.classList.add('is-show');
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
        stat(fmt(progress.points), 'toplam puan'),
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

    // Menü açıkken sayfa bildirimi menünün arkasında kalır; geri bildirim düğmenin kendisinde verilir.
    copyFeedback(text) {
      clearTimeout(copyTimer);
      els.copyFlags.textContent = text;
      copyTimer = setTimeout(() => { els.copyFlags.textContent = 'Listeyi kopyala'; }, 2000);
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

    showHint(onHidden) {
      els.hint.hidden = false;
      let done = false;
      const hide = () => {
        if (done) return;
        done = true;
        els.hint.hidden = true;
        onHidden?.();
      };
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
