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
  const fingerprints = new Map();
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
      const fingerprint = cardId(course, card);
      const validId = typeof card.id === 'string' && new RegExp(`^${course}-[0-9a-z]{7}$`).test(card.id);
      if (card.id !== undefined && !validId) {
        errors.push(`${where}: geçersiz kalıcı kimlik: ${card.id}`);
        return;
      }
      const id = card.id ?? fingerprint;
      if (seen.has(id) || fingerprints.has(fingerprint)) {
        errors.push(`${where}: tekrarlanan kart (${seen.get(id) ?? fingerprints.get(fingerprint)} ile aynı)`);
        return;
      }
      seen.set(id, where);
      fingerprints.set(fingerprint, where);
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

export function distributionWarnings(stats, minTotal = 450) {
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
      await rm(target, { force: true });
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
