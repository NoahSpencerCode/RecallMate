#!/usr/bin/env node
// A random, reproducible sample of a profession's cards, spread across modules:
// for spot-check audits and review pages.
//
//   npm run professions:sample -- mathematics --count 40 [--modules a,b] [--seed 7] [--out sample.json]
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
const arg = (name) => {
  const i = process.argv.indexOf(`--${name}`);
  return i === -1 ? undefined : process.argv[i + 1];
};
const slug = process.argv[2];
if (!slug || slug.startsWith('--')) {
  console.error('Usage: sample.mjs <profession> [--count 40] [--modules a,b] [--seed 7] [--out file.json]');
  process.exit(1);
}
const count = Number(arg('count') ?? 40);
const onlyModules = arg('modules')?.split(',').map((s) => s.trim());
let seed = Number(arg('seed') ?? 7) >>> 0;
const random = () => {
  seed = (seed + 0x6d2b79f5) >>> 0;
  let t = seed;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

const dir = join(root, 'content', 'professions', slug);
const curriculum = JSON.parse(readFileSync(join(dir, 'curriculum.json'), 'utf8'));
const moduleInfo = new Map();
for (const tier of curriculum.tiers) for (const m of tier.modules) moduleInfo.set(m.slug, { tier: tier.tier, tierName: tier.name, title: m.title });

const byModule = new Map();
const cardsDir = join(dir, 'cards');
for (const tierDir of existsSync(cardsDir) ? readdirSync(cardsDir, { withFileTypes: true }) : []) {
  if (!tierDir.isDirectory()) continue;
  for (const f of readdirSync(join(cardsDir, tierDir.name))) {
    if (!f.endsWith('.json')) continue;
    const file = JSON.parse(readFileSync(join(cardsDir, tierDir.name, f), 'utf8'));
    if (onlyModules && !onlyModules.includes(file.module)) continue;
    byModule.set(
      file.module,
      file.cards.filter((c) => !c.retired),
    );
  }
}

// Round-robin across modules so every module is represented.
const pools = [...byModule.entries()].map(([module, cards]) => ({
  module,
  cards: cards.map((c) => ({ c, r: random() })).sort((a, b) => a.r - b.r).map((x) => x.c),
}));
const sample = [];
while (sample.length < count && pools.some((p) => p.cards.length)) {
  for (const pool of pools) {
    if (sample.length >= count) break;
    const card = pool.cards.shift();
    if (card) sample.push({ module: pool.module, ...moduleInfo.get(pool.module), card });
  }
}
sample.sort((a, b) => a.tier - b.tier || a.module.localeCompare(b.module));

const out = arg('out');
const text = JSON.stringify({ profession: slug, count: sample.length, sample }, null, 2);
if (out) {
  writeFileSync(resolve(root, out), `${text}\n`);
  console.log(`Wrote ${sample.length} cards to ${out}`);
} else {
  console.log(text);
}
