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
