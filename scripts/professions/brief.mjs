#!/usr/bin/env node
// Writes the brief a card writer works from: one module's units, the terms
// already taught before it, the notation sheet and where the module sits.
//
//   node scripts/professions/brief.mjs <profession> <module> [--units a,b] [--first-half] [--out brief.md]
//
// --units / --first-half limit the brief to some units (the rest of the module
// is written later); the card file is then marked "partial": true.
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
const [slug, moduleSlug] = process.argv.slice(2);
const arg = (name) => {
  const i = process.argv.indexOf(`--${name}`);
  return i === -1 ? undefined : process.argv[i + 1];
};
if (!slug || !moduleSlug) {
  console.error('Usage: brief.mjs <profession> <module> [--units a,b] [--first-half] [--out brief.md]');
  process.exit(1);
}
const dir = join(root, 'content', 'professions', slug);
const profession = JSON.parse(readFileSync(join(dir, 'profession.json'), 'utf8'));
const curriculum = JSON.parse(readFileSync(join(dir, 'curriculum.json'), 'utf8'));

// Teaching order across the whole profession: tier by tier, each tier in its own order.
const sequence = [];
for (const tier of curriculum.tiers) {
  const order = tier.order ?? tier.modules.flatMap((m) => m.units.map((u) => `${m.slug}/${u.slug}`));
  for (const ref of order) {
    const [m, u] = ref.split('/');
    const module = tier.modules.find((x) => x.slug === m);
    sequence.push({ tier, module, unit: module.units.find((x) => x.slug === u) });
  }
}
const tier = curriculum.tiers.find((t) => t.modules.some((m) => m.slug === moduleSlug));
if (!tier) {
  console.error(`No module ${moduleSlug} in ${slug}`);
  process.exit(1);
}
const module = tier.modules.find((m) => m.slug === moduleSlug);

let units = module.units;
const only = arg('units')?.split(',').map((s) => s.trim());
if (only) units = units.filter((u) => only.includes(u.slug));
if (process.argv.includes('--first-half')) {
  let total = 0;
  units = units.filter((u) => {
    if (total >= module.plannedCards / 2) return false;
    total += u.plannedCards;
    return true;
  });
}
const partial = units.length < module.units.length;
const firstIndex = sequence.findIndex((s) => s.module.slug === moduleSlug && units.some((u) => u.slug === s.unit.slug));
const earlier = sequence.slice(0, firstIndex);
// Terms from earlier units of this module are listed with the units themselves.
const taught = new Map();
for (const s of earlier) {
  const key = `${s.tier.name} · ${s.module.title}`;
  if (!taught.has(key)) taught.set(key, []);
  taught.get(key).push(...s.unit.keyTerms);
}
const tierCards = curriculum.tiers.map((t) => t.modules.flatMap((m) => m.units)).map((us) => us.flatMap((u) => u.difficulty));
const band = [Math.min(...tierCards[tier.tier]), Math.max(...tierCards[tier.tier])];
const cards = units.reduce((n, u) => n + u.plannedCards, 0);
const tierDir = tier.slug;

const lines = [];
lines.push(`# Brief: ${profession.name} · ${tier.name} · ${module.title}`);
lines.push('');
lines.push(`- **Card file:** \`content/professions/${slug}/cards/${tierDir}/${moduleSlug}.json\` with \`"profession": "${slug}"\`, \`"module": "${moduleSlug}"\`, \`"tier": ${tier.tier}\`${partial ? ', `"partial": true`' : ''}.`);
lines.push(`- **Cards to write:** ${cards}${partial ? ` (the units below only; the rest of this ${module.plannedCards}-card module comes later)` : ` (the whole module, ±10%)`}.`);
lines.push(`- **Difficulty band of this tier:** ${band[0]}–${band[1]} on the profession's 1–10 scale.`);
lines.push(`- **Card ids** are kebab-case and descriptive, unique across the whole profession (prefixing with a short module word helps, e.g. \`${moduleSlug.split('-')[0]}-…\`).`);
lines.push('');
lines.push('## Where this sits');
lines.push('');
lines.push(`**This tier, ${tier.name}:** ${tier.summary}`);
lines.push('');
lines.push(`**This module:** ${module.summary}`);
if (module.refs?.length) lines.push(`\n**Standard references:** ${module.refs.join('; ')}`);
if (module.practice?.length) lines.push(`\n**Hands-on projects shown with this module:** ${module.practice.map((p) => p.title).join('; ')}`);
lines.push('');
lines.push('## Units to write, in teaching order');
for (const u of units) {
  lines.push('');
  lines.push(`### \`${u.slug}\`: ${u.title} (${u.plannedCards} cards, difficulty ${u.difficulty[0]}–${u.difficulty[1]})`);
  lines.push('');
  lines.push(`- **Objectives:** ${u.objectives.join(' · ')}`);
  lines.push(`- **New terms this unit introduces:** ${u.keyTerms.join(', ') || '(none listed)'}`);
  if (u.prereqs?.length) lines.push(`- **Builds on:** ${u.prereqs.join(', ')}`);
  lines.push(`- **Card kinds:** ${Object.entries(u.kinds).map(([k, n]) => `${k} ×${n}`).join(', ')}`);
  if (u.refs?.length) lines.push(`- **References:** ${u.refs.join('; ')}`);
}
if (partial) {
  const later = module.units.filter((u) => !units.includes(u));
  lines.push('');
  lines.push(`Later units of this module (don't write these yet, and don't use their terms): ${later.map((u) => `${u.title}`).join('; ')}.`);
}
lines.push('');
lines.push('## Notation (follow exactly)');
lines.push('');
for (const n of profession.notation ?? []) lines.push(`- ${n}`);
lines.push('');
lines.push('## Terms already taught before this module (use freely; anything else must be introduced on a card first)');
lines.push('');
if (!taught.size) lines.push('Nothing yet: this is the very beginning of the path. Assume only everyday language and arithmetic as each card itself explains.');
for (const [where, terms] of taught) lines.push(`- **${where}:** ${[...new Set(terms)].join(', ')}`);
lines.push('');

const text = lines.join('\n');
const out = arg('out');
if (out) writeFileSync(resolve(out), text);
else process.stdout.write(text);
