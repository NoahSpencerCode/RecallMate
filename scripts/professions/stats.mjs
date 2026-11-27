#!/usr/bin/env node
// How far along a profession's cards are: written against the plan, kind mix
// and difficulty, per module and tier.
//
//   npm run professions:stats -- mathematics
//   npm run professions:stats -- mathematics --json
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
const slug = process.argv[2];
const asJson = process.argv.includes('--json');
if (!slug || slug.startsWith('--')) {
  console.error('Usage: stats.mjs <profession> [--json]');
  process.exit(1);
}
const dir = join(root, 'content', 'professions', slug);
const curriculum = JSON.parse(readFileSync(join(dir, 'curriculum.json'), 'utf8'));
const files = new Map();
const cardsDir = join(dir, 'cards');
if (existsSync(cardsDir)) {
  for (const tierDir of readdirSync(cardsDir, { withFileTypes: true })) {
    if (!tierDir.isDirectory()) continue;
    for (const f of readdirSync(join(cardsDir, tierDir.name))) {
      if (!f.endsWith('.json')) continue;
      const file = JSON.parse(readFileSync(join(cardsDir, tierDir.name, f), 'utf8'));
      files.set(file.module, file);
    }
  }
}

const report = { profession: slug, planned: 0, written: 0, tiers: [] };
for (const tier of curriculum.tiers) {
  const t = { tier: tier.tier, name: tier.name, planned: tier.plannedCards, written: 0, checkpoints: 0, modules: [] };
  for (const module of tier.modules) {
    const file = files.get(module.slug);
    const live = (file?.cards ?? []).filter((c) => !c.retired);
    const planKinds = {};
    for (const unit of module.units) for (const [k, n] of Object.entries(unit.kinds ?? {})) planKinds[k] = (planKinds[k] ?? 0) + n;
    const kinds = {};
    for (const c of live) kinds[c.kind] = (kinds[c.kind] ?? 0) + 1;
    const off = Object.keys({ ...planKinds, ...kinds })
      .map((k) => ({ kind: k, planned: planKinds[k] ?? 0, written: kinds[k] ?? 0 }))
      .filter((d) => Math.abs(d.written - d.planned) > Math.max(2, d.planned * 0.25));
    const difficulties = live.map((c) => c.difficulty);
    const m = {
      module: module.slug,
      planned: module.plannedCards,
      written: live.length,
      status: !file ? 'not started' : file.partial ? 'partial' : 'complete',
      checkpoints: live.filter((c) => c.checkpoint).length,
      difficulty: difficulties.length ? [Math.min(...difficulties), Math.max(...difficulties)] : null,
      kindMixOff: off,
    };
    t.written += m.written;
    t.checkpoints += m.checkpoints;
    t.modules.push(m);
  }
  report.planned += t.planned;
  report.written += t.written;
  report.tiers.push(t);
}

if (asJson) {
  console.log(JSON.stringify(report, null, 2));
} else {
  const pct = (a, b) => `${Math.round((a / Math.max(1, b)) * 100)}%`.padStart(5);
  console.log(`${slug}: ${report.written} of ${report.planned} cards written (${pct(report.written, report.planned).trim()})\n`);
  for (const t of report.tiers) {
    console.log(`Tier ${t.tier} · ${t.name}: ${t.written}/${t.planned} ${pct(t.written, t.planned)} · ${t.checkpoints} checkpoints`);
    for (const m of t.modules) {
      const mix = m.kindMixOff.length ? `  mix off: ${m.kindMixOff.map((d) => `${d.kind} ${d.written}/${d.planned}`).join(', ')}` : '';
      const diff = m.difficulty ? `  difficulty ${m.difficulty[0]}–${m.difficulty[1]}` : '';
      console.log(`  ${m.module.padEnd(34)} ${String(m.written).padStart(4)}/${String(m.planned).padEnd(4)} ${m.status.padEnd(11)}${diff}${mix}`);
    }
  }
}
