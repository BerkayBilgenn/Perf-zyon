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
