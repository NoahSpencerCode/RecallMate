#!/usr/bin/env node
// Builds a module's card file from per-unit drafts, so a writer can produce
// one unit at a time.
//
//   node scripts/professions/assemble.mjs <profession> <module> <draft-dir> [--partial]
//
// <draft-dir> holds one JSON file per unit, named <unit-slug>.json, each an
// array of cards (the "unit" field is filled in from the file name). Cards are
// written in the curriculum's unit order, then the order within each draft.
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
const [slug, moduleSlug, draftDir] = process.argv.slice(2);
if (!slug || !moduleSlug || !draftDir) {
  console.error('Usage: assemble.mjs <profession> <module> <draft-dir> [--partial]');
  process.exit(1);
}
const curriculum = JSON.parse(readFileSync(join(root, 'content', 'professions', slug, 'curriculum.json'), 'utf8'));
const tier = curriculum.tiers.find((t) => t.modules.some((m) => m.slug === moduleSlug));
if (!tier) {
  console.error(`No module ${moduleSlug} in ${slug}`);
  process.exit(1);
}
const module = tier.modules.find((m) => m.slug === moduleSlug);
const drafts = resolve(draftDir);
const available = new Set(readdirSync(drafts).filter((f) => f.endsWith('.json')).map((f) => f.replace(/\.json$/, '')));
const unknown = [...available].filter((u) => !module.units.some((x) => x.slug === u));
if (unknown.length) {
  console.error(`Drafts for units not in ${moduleSlug}: ${unknown.join(', ')}`);
  process.exit(1);
}

const cards = [];
for (const unit of module.units) {
  if (!available.has(unit.slug)) continue;
  const parsed = JSON.parse(readFileSync(join(drafts, `${unit.slug}.json`), 'utf8'));
  const list = Array.isArray(parsed) ? parsed : parsed.cards;
  for (const card of list) cards.push({ id: card.id, unit: unit.slug, ...Object.fromEntries(Object.entries(card).filter(([k]) => k !== 'id' && k !== 'unit')) });
}
const partial = process.argv.includes('--partial') || module.units.some((u) => !available.has(u.slug));
const outDir = join(root, 'content', 'professions', slug, 'cards', tier.slug);
mkdirSync(outDir, { recursive: true });
const file = { profession: slug, module: moduleSlug, tier: tier.tier, ...(partial ? { partial: true } : {}), cards };
const out = join(outDir, `${moduleSlug}.json`);
writeFileSync(out, `${JSON.stringify(file, null, 2)}\n`);
console.log(`Wrote content/professions/${slug}/cards/${tier.slug}/${moduleSlug}.json: ${cards.length} cards${partial ? ' (partial)' : ''}${existsSync(out) ? '' : ''}`);
