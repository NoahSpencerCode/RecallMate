#!/usr/bin/env node
// Turns content/professions/<slug>/ into a Supabase migration.
//
//   npm run professions:build -- --profession mathematics --out supabase/migrations/<ts>_mathematics_t0.sql
//
// Options:
//   --profession <slug>      required
//   --out <file.sql>         required
//   --tiers 0,1,2            which tiers' cards to include (default: every tier with card files)
//   --changed-since <ref>    delta mode: only cards that are new or changed since a git ref
//                            (for typo fixes, so a small edit isn't a multi-megabyte migration)
//   --allow-partial          include modules still marked "partial": true
//   --release                record the built card ids in shipped-ids.json (do this for
//                            migrations that will ship; validation then refuses to let them vanish)
//
// Every build upserts the profession, all of its tiers and all of its modules,
// so the curriculum map shows the whole path even before later tiers ship.
// Cards are upserted by id. Cards of the built tiers that are no longer in the
// content are retired, never deleted: learners' progress points at them.
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const TIER_SPAN = 1_000_000;

function arg(name) {
  const i = process.argv.indexOf(`--${name}`);
  return i === -1 ? undefined : process.argv[i + 1];
}
const flag = (name) => process.argv.includes(`--${name}`);

const slug = arg('profession');
const outArg = arg('out');
const tiersArg = arg('tiers');
const changedSince = arg('changed-since');
const allowPartial = flag('allow-partial');
const release = flag('release');
if (!slug || !outArg) {
  console.error('Usage: build-professions-migration.mjs --profession <slug> --out <file.sql> [--tiers 0,1] [--changed-since <ref>] [--allow-partial] [--release]');
  process.exit(1);
}
const contentDir = join(root, 'content', 'professions', slug);
const rel = (path) => relative(root, path).split('\\').join('/');

// ---------------------------------------------------------------- reading content

/** Reads the profession from the working tree, or from a git ref (for delta builds). */
function readContent(ref) {
  const read = ref
    ? (path) => {
        try {
          return execFileSync('git', ['show', `${ref}:${rel(path)}`], { cwd: root, encoding: 'utf8', maxBuffer: 1 << 28 });
        } catch {
          return null;
        }
      }
    : (path) => (existsSync(path) ? readFileSync(path, 'utf8') : null);
  const listCardFiles = ref
    ? () => {
        try {
          return execFileSync('git', ['ls-tree', '-r', '--name-only', ref, rel(join(contentDir, 'cards'))], { cwd: root, encoding: 'utf8' })
            .split('\n')
            .filter((line) => line.endsWith('.json'))
            .map((line) => join(root, line));
        } catch {
          return [];
        }
      }
    : () => {
        const dir = join(contentDir, 'cards');
        if (!existsSync(dir)) return [];
        return readdirSync(dir, { withFileTypes: true })
          .filter((e) => e.isDirectory())
          .flatMap((e) => readdirSync(join(dir, e.name)).filter((f) => f.endsWith('.json')).map((f) => join(dir, e.name, f)));
      };

  const professionText = read(join(contentDir, 'profession.json'));
  const curriculumText = read(join(contentDir, 'curriculum.json'));
  if (!professionText || !curriculumText) return null;
  const files = new Map();
  for (const path of listCardFiles()) {
    const text = read(path);
    if (!text) continue;
    const file = JSON.parse(text);
    files.set(file.module, file);
  }
  return { profession: JSON.parse(professionText), curriculum: JSON.parse(curriculumText), files };
}

/** Every card of the chosen tiers, in teaching order, with its position. */
function cardRows(content, tierNumbers) {
  const rows = [];
  for (const tier of content.curriculum.tiers) {
    if (!tierNumbers.includes(tier.tier)) continue;
    const order = tier.order ?? tier.modules.flatMap((m) => m.units.map((u) => `${m.slug}/${u.slug}`));
    let index = 0;
    for (const ref of order) {
      const [moduleSlug, unitSlug] = ref.split('/');
      const file = content.files.get(moduleSlug);
      if (!file || (file.partial && !allowPartial)) continue;
      for (const card of file.cards.filter((c) => c.unit === unitSlug)) {
        rows.push({
          id: `${slug}/${card.id}`,
          module_id: `${slug}/${moduleSlug}`,
          position: tier.tier * TIER_SPAN + index++,
          kind: card.kind,
          difficulty: card.difficulty,
          checkpoint: Boolean(card.checkpoint),
          title: card.title,
          body: card.body,
          answer: card.answer ?? null,
          accepted_answers: card.acceptedAnswers ?? [],
          answer_display: card.answerDisplay ?? null,
          search_query: card.searchQuery ?? null,
          refs: card.refs ?? [],
          tags: card.tags ?? [],
          as_of: card.asOf ?? null,
          retired: Boolean(card.retired),
        });
      }
    }
  }
  return rows;
}

const content = readContent();
if (!content) {
  console.error(`content/professions/${slug}: profession.json and curriculum.json are required`);
  process.exit(1);
}
const tiersWithCards = content.curriculum.tiers
  .filter((tier) => tier.modules.some((m) => content.files.has(m.slug)))
  .map((tier) => tier.tier);
const tierNumbers = tiersArg ? tiersArg.split(',').map((t) => Number(t.trim())) : tiersWithCards;
for (const t of tierNumbers) {
  if (!content.curriculum.tiers.some((tier) => tier.tier === t)) {
    console.error(`No tier ${t} in ${slug}`);
    process.exit(1);
  }
}
const partial = [...content.files.values()].filter((f) => f.partial && tierNumbers.includes(f.tier));
if (partial.length && !allowPartial) {
  console.warn(`Skipping partial modules: ${partial.map((f) => f.module).join(', ')} (pass --allow-partial to include them)`);
}

let rows = cardRows(content, tierNumbers);
let retireIds = [];
if (changedSince) {
  const before = readContent(changedSince);
  const old = new Map((before ? cardRows(before, tierNumbers) : []).map((row) => [row.id, JSON.stringify(row)]));
  const now = new Set(rows.map((row) => row.id));
  retireIds = [...old.keys()].filter((id) => !now.has(id));
  rows = rows.filter((row) => old.get(row.id) !== JSON.stringify(row));
}

// ---------------------------------------------------------------- SQL

const lit = (value) => {
  if (value === null || value === undefined) return 'null';
  if (typeof value === 'number') return String(value);
  if (typeof value === 'boolean') return value ? 'true' : 'false';
  return `'${String(value).replace(/'/g, "''")}'`;
};
const textArray = (values) => (values.length ? `array[${values.map(lit).join(', ')}]::text[]` : `'{}'::text[]`);

const p = content.profession;
const plannedTotal = content.curriculum.tiers.reduce((n, tier) => n + tier.plannedCards, 0);
const tempTable = `profession_card_rows_${createHash('md5').update(`${slug}:${outArg}`).digest('hex').slice(0, 10)}`;
const builtModules = content.curriculum.tiers
  .filter((tier) => tierNumbers.includes(tier.tier))
  .flatMap((tier) => tier.modules.map((m) => `${slug}/${m.slug}`))
  .filter((id) => {
    const file = content.files.get(id.split('/')[1]);
    return file && (!file.partial || allowPartial);
  });

const sql = [];
sql.push(`-- Generated by scripts/build-professions-migration.mjs. Do not edit by hand.`);
sql.push(`-- Profession: ${slug} · tiers ${tierNumbers.join(', ')} · ${rows.length} cards${changedSince ? ` changed since ${changedSince}` : ''}`);
sql.push('');
sql.push(`insert into public.professions (id, name, tagline, description, icon, accent, gradient, planned_cards, position)`);
sql.push(
  `values (${[slug, p.name, p.tagline, p.description, p.icon, p.accent].map(lit).join(', ')}, ${textArray(p.gradient)}, ${plannedTotal}, ${p.position ?? 0})`,
);
sql.push(`on conflict (id) do update set name = excluded.name, tagline = excluded.tagline, description = excluded.description,`);
sql.push(`  icon = excluded.icon, accent = excluded.accent, gradient = excluded.gradient, planned_cards = excluded.planned_cards,`);
sql.push(`  position = excluded.position;`);
sql.push('');
sql.push(`insert into public.profession_tiers (profession_id, tier, slug, name, milestone, summary, planned_cards) values`);
sql.push(
  content.curriculum.tiers
    .map((tier) => `  (${[slug, tier.tier, tier.slug, tier.name, tier.milestone, tier.summary, tier.plannedCards].map(lit).join(', ')})`)
    .join(',\n'),
);
sql.push(`on conflict (profession_id, tier) do update set slug = excluded.slug, name = excluded.name, milestone = excluded.milestone,`);
sql.push(`  summary = excluded.summary, planned_cards = excluded.planned_cards;`);
sql.push('');
let modulePosition = 0;
const moduleValues = content.curriculum.tiers.flatMap((tier) =>
  tier.modules.map(
    (m) =>
      `  (${[`${slug}/${m.slug}`, slug, tier.tier, modulePosition++, m.title, m.summary, m.plannedCards].map(lit).join(', ')}, ${textArray(
        m.refs ?? [],
      )}, ${lit(JSON.stringify(m.practice ?? []))}::jsonb)`,
  ),
);
sql.push(`insert into public.profession_modules (id, profession_id, tier, position, title, summary, planned_cards, refs, practice) values`);
sql.push(moduleValues.join(',\n'));
sql.push(`on conflict (id) do update set tier = excluded.tier, position = excluded.position, title = excluded.title,`);
sql.push(`  summary = excluded.summary, planned_cards = excluded.planned_cards, refs = excluded.refs, practice = excluded.practice;`);
sql.push('');

const columns =
  'id, profession_id, module_id, position, kind, difficulty, checkpoint, title, body, answer, accepted_answers, answer_display, search_query, refs, tags, as_of, retired';
if (rows.length) {
  sql.push(`create temporary table ${tempTable} (like public.profession_cards);`);
  // Batches of 200 rows keep each statement a reasonable size.
  for (let i = 0; i < rows.length; i += 200) {
    sql.push(`insert into ${tempTable} (${columns}) values`);
    sql.push(
      rows
        .slice(i, i + 200)
        .map(
          (r) =>
            `  (${[r.id, slug, r.module_id, r.position, r.kind, r.difficulty, r.checkpoint, r.title, r.body, r.answer]
              .map(lit)
              .join(', ')}, ${textArray(r.accepted_answers)}, ${lit(r.answer_display)}, ${lit(r.search_query)}, ${textArray(
              r.refs,
            )}, ${textArray(r.tags)}, ${r.as_of ? `${lit(r.as_of)}::date` : 'null'}, ${lit(r.retired)})`,
        )
        .join(',\n') + ';',
    );
  }
  sql.push(`insert into public.profession_cards (${columns})`);
  sql.push(`select ${columns} from ${tempTable}`);
  sql.push(`on conflict (id) do update set module_id = excluded.module_id, position = excluded.position, kind = excluded.kind,`);
  sql.push(`  difficulty = excluded.difficulty, checkpoint = excluded.checkpoint, title = excluded.title, body = excluded.body,`);
  sql.push(`  answer = excluded.answer, accepted_answers = excluded.accepted_answers, answer_display = excluded.answer_display,`);
  sql.push(`  search_query = excluded.search_query, refs = excluded.refs, tags = excluded.tags, as_of = excluded.as_of,`);
  sql.push(`  retired = excluded.retired;`);
  sql.push('');
}
if (!changedSince && builtModules.length) {
  sql.push(`-- Cards of these modules that are no longer in the content are retired, never deleted.`);
  sql.push(`update public.profession_cards set retired = true`);
  sql.push(` where module_id in (${builtModules.map(lit).join(', ')})`);
  sql.push(`   and not retired`);
  sql.push(`   and id not in (${rows.length ? `select id from ${tempTable}` : `''`});`);
} else if (retireIds.length) {
  sql.push(`update public.profession_cards set retired = true where id in (${retireIds.map(lit).join(', ')});`);
}
if (rows.length) sql.push(`drop table ${tempTable};`);

const out = resolve(root, outArg);
mkdirSync(dirname(out), { recursive: true });
const text = `${sql.join('\n')}\n`;
writeFileSync(out, text);

if (release) {
  const manifestPath = join(contentDir, 'shipped-ids.json');
  const manifest = existsSync(manifestPath) ? JSON.parse(readFileSync(manifestPath, 'utf8')) : { ids: [] };
  const ids = new Set(manifest.ids);
  for (const row of rows) ids.add(row.id.slice(slug.length + 1));
  writeFileSync(manifestPath, `${JSON.stringify({ ids: [...ids].sort() }, null, 2)}\n`);
}

console.log(
  `Wrote ${out.startsWith(root) ? rel(out) : out}: ${rows.length} cards in tiers ${tierNumbers.join(', ')}, ${(text.length / 1024 / 1024).toFixed(2)} MB, md5 ${createHash('md5')
    .update(text)
    .digest('hex')}${release ? ' (ids recorded in shipped-ids.json)' : ''}`,
);
