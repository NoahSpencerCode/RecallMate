/// <reference types="node" />
/**
 * Checks for profession content in content/professions (see its README.md).
 * Used by curriculum.<profession>.test.ts:
 *
 *   npx jest curriculum                                          # everything
 *   npx jest curriculum.mathematics                              # one profession
 *   MODULE=real-analysis-1 npx jest curriculum.mathematics       # one module, in seconds
 */
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

import { ID, markupProblems, normalizedPrompt, searchQueryProblems, typedAnswerProblems } from '@/lib/cardRules';
import { parseBlocks, parseRich, plainText, splitAnswer } from '@/lib/rich';

const glyphs = require('@expo/vector-icons/build/vendor/react-native-vector-icons/glyphmaps/MaterialCommunityIcons.json') as Record<
  string,
  number
>;

export const ROOT = join(__dirname, '..', '..', '..', '..', 'content', 'professions');

export const KINDS = [
  'definition',
  'concept',
  'theorem',
  'proof-idea',
  'example',
  'counterexample',
  'problem',
  'formula',
  'code',
  'numbers',
  'trade-off',
  'landmark',
  'misconception',
] as const;
type Kind = (typeof KINDS)[number];

export type Unit = {
  slug: string;
  title: string;
  objectives: string[];
  keyTerms: string[];
  prereqs: string[];
  plannedCards: number;
  kinds: Partial<Record<Kind, number>>;
  difficulty: [number, number];
  refs?: string[];
};
export type Module = {
  slug: string;
  title: string;
  summary: string;
  plannedCards: number;
  refs?: string[];
  practice?: { title: string; url: string }[];
  units: Unit[];
};
export type Tier = {
  tier: number;
  slug: string;
  name: string;
  milestone: string | null;
  summary: string;
  plannedCards: number;
  order?: string[];
  modules: Module[];
};
export type Curriculum = { profession: string; tiers: Tier[] };
export type ProfessionMeta = {
  id: string;
  name: string;
  tagline: string;
  description: string;
  icon: string;
  accent: string;
  gradient: string[];
  position?: number;
  notation?: string[];
};
export type Card = {
  id: string;
  unit: string;
  kind: Kind;
  difficulty: number;
  checkpoint?: boolean;
  title: string;
  body: string;
  answer?: string | null;
  acceptedAnswers?: string[];
  answerDisplay?: string | null;
  searchQuery: string;
  refs?: string[];
  tags?: string[];
  asOf?: string | null;
  retired?: boolean;
};
export type CardFile = { profession: string; module: string; tier: number; partial?: boolean; cards: Card[] };

export type Loaded = {
  slug: string;
  profession: ProfessionMeta | null;
  curriculum: Curriculum | null;
  /** Card files by module slug. */
  files: Map<string, { path: string; file: CardFile | null; error?: string }>;
  problems: string[];
};

const HEX = /^#[0-9A-Fa-f]{6}$/;
const DATE = /^\d{4}-\d{2}-\d{2}$/;
const LONG_KINDS = new Set(['problem', 'code']);
const LONG_BODY_KINDS = new Set(['problem', 'code', 'proof-idea']);

function readJson<T>(path: string): { value: T | null; error?: string } {
  try {
    return { value: JSON.parse(readFileSync(path, 'utf8')) as T };
  } catch (error) {
    return { value: null, error: (error as Error).message };
  }
}

export function listProfessions(): string[] {
  if (!existsSync(ROOT)) return [];
  return readdirSync(ROOT, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && existsSync(join(ROOT, entry.name, 'profession.json')))
    .map((entry) => entry.name)
    .sort();
}

export function loadProfession(slug: string): Loaded {
  const dir = join(ROOT, slug);
  const problems: string[] = [];
  const profession = readJson<ProfessionMeta>(join(dir, 'profession.json'));
  if (profession.error) problems.push(`profession.json: ${profession.error}`);
  const curriculumPath = join(dir, 'curriculum.json');
  const curriculum = existsSync(curriculumPath) ? readJson<Curriculum>(curriculumPath) : { value: null, error: 'missing' };
  if (curriculum.error) problems.push(`curriculum.json: ${curriculum.error}`);

  const files = new Map<string, { path: string; file: CardFile | null; error?: string }>();
  const cardsDir = join(dir, 'cards');
  if (existsSync(cardsDir)) {
    for (const tierDir of readdirSync(cardsDir, { withFileTypes: true })) {
      if (!tierDir.isDirectory()) continue;
      for (const entry of readdirSync(join(cardsDir, tierDir.name))) {
        if (!entry.endsWith('.json')) continue;
        const path = join(cardsDir, tierDir.name, entry);
        const { value, error } = readJson<CardFile>(path);
        files.set(entry.replace(/\.json$/, ''), { path: `cards/${tierDir.name}/${entry}`, file: value, error });
      }
    }
  }
  return { slug, profession: profession.value, curriculum: curriculum.value, files, problems };
}

/** Every module in teaching order, with its tier. */
export function modulesOf(curriculum: Curriculum): { tier: Tier; module: Module }[] {
  return curriculum.tiers.flatMap((tier) => tier.modules.map((module) => ({ tier, module })));
}

/** profession.json and curriculum.json: shape, budgets and teaching order. */
export function structureProblems(loaded: Loaded): string[] {
  const problems = [...loaded.problems];
  const { profession: p, curriculum: c, slug } = loaded;
  if (p) {
    if (p.id !== slug) problems.push(`profession.json: id "${p.id}" should be "${slug}"`);
    if (!p.name?.trim() || p.name.length > 80) problems.push('profession.json: name must be 1–80 characters');
    if (!p.tagline?.trim() || p.tagline.length > 200) problems.push('profession.json: tagline must be 1–200 characters');
    if (!p.description?.trim() || p.description.length > 2000) problems.push('profession.json: description must be 1–2000 characters');
    if (!(p.icon in glyphs)) problems.push(`profession.json: "${p.icon}" isn't a MaterialCommunityIcons name`);
    if (!HEX.test(p.accent ?? '')) problems.push('profession.json: accent must be a #RRGGBB colour');
    if (!Array.isArray(p.gradient) || p.gradient.length !== 2 || !p.gradient.every((g) => HEX.test(g))) {
      problems.push('profession.json: gradient must be two #RRGGBB colours');
    }
  }
  if (!c) return problems;
  if (c.profession !== slug) problems.push(`curriculum.json: profession "${c.profession}" should be "${slug}"`);
  if (!Array.isArray(c.tiers) || !c.tiers.length) return [...problems, 'curriculum.json: no tiers'];

  const moduleSlugs = new Set<string>();
  const unitRefs = new Set<string>();
  for (const { module } of modulesOf(c)) {
    moduleSlugs.add(module.slug);
    for (const unit of module.units ?? []) unitRefs.add(`${module.slug}/${unit.slug}`);
  }

  c.tiers.forEach((tier, index) => {
    const at = `tier ${tier.tier} (${tier.slug})`;
    if (tier.tier !== index) problems.push(`${at}: tiers must be numbered 0, 1, 2… in order`);
    if (!ID.test(tier.slug ?? '')) problems.push(`${at}: slug must be kebab-case`);
    if (!tier.name?.trim()) problems.push(`${at}: missing name`);
    if (!tier.summary?.trim()) problems.push(`${at}: missing summary`);
    if (tier.milestone !== null && typeof tier.milestone !== 'string') problems.push(`${at}: milestone must be text or null`);
    const moduleTotal = (tier.modules ?? []).reduce((n, m) => n + (m.plannedCards ?? 0), 0);
    if (moduleTotal !== tier.plannedCards) problems.push(`${at}: modules plan ${moduleTotal} cards, the tier plans ${tier.plannedCards}`);

    const tierUnits = (tier.modules ?? []).flatMap((m) => (m.units ?? []).map((u) => `${m.slug}/${u.slug}`));
    if (tier.order) {
      const seen = new Set<string>();
      for (const ref of tier.order) {
        if (!tierUnits.includes(ref)) problems.push(`${at}: order lists "${ref}", which isn't a unit of this tier`);
        if (seen.has(ref)) problems.push(`${at}: order lists "${ref}" twice`);
        seen.add(ref);
      }
      for (const ref of tierUnits) if (!seen.has(ref)) problems.push(`${at}: order leaves out "${ref}"`);
    }

    const seenModules = new Set<string>();
    for (const module of tier.modules ?? []) {
      const mat = `module ${module.slug}`;
      if (!ID.test(module.slug ?? '')) problems.push(`${mat}: slug must be kebab-case`);
      if (seenModules.has(module.slug)) problems.push(`${mat}: duplicate module slug`);
      seenModules.add(module.slug);
      if (!module.title?.trim() || !module.summary?.trim()) problems.push(`${mat}: needs a title and summary`);
      for (const link of module.practice ?? []) {
        if (!link.title?.trim() || !/^https:\/\//.test(link.url ?? '')) problems.push(`${mat}: practice links need a title and an https URL`);
      }
      const units = module.units ?? [];
      if (!units.length) problems.push(`${mat}: no units`);
      const unitTotal = units.reduce((n, u) => n + (u.plannedCards ?? 0), 0);
      if (unitTotal !== module.plannedCards) problems.push(`${mat}: units plan ${unitTotal} cards, the module plans ${module.plannedCards}`);
      const seenUnits = new Set<string>();
      for (const unit of units) {
        const uat = `${mat}/${unit.slug}`;
        if (!ID.test(unit.slug ?? '')) problems.push(`${uat}: slug must be kebab-case`);
        if (seenUnits.has(unit.slug)) problems.push(`${uat}: duplicate unit slug`);
        seenUnits.add(unit.slug);
        if (!unit.title?.trim()) problems.push(`${uat}: missing title`);
        if (!Array.isArray(unit.objectives) || !unit.objectives.length) problems.push(`${uat}: needs objectives`);
        if (!Array.isArray(unit.keyTerms)) problems.push(`${uat}: keyTerms must be a list`);
        for (const ref of unit.prereqs ?? []) {
          if (!moduleSlugs.has(ref) && !unitRefs.has(ref)) problems.push(`${uat}: prerequisite "${ref}" doesn't exist`);
        }
        const kinds = Object.entries(unit.kinds ?? {});
        const kindTotal = kinds.reduce((n, [, count]) => n + (count ?? 0), 0);
        if (kindTotal !== unit.plannedCards) problems.push(`${uat}: kinds add up to ${kindTotal}, the unit plans ${unit.plannedCards}`);
        for (const [kind] of kinds) if (!KINDS.includes(kind as Kind)) problems.push(`${uat}: unknown kind "${kind}"`);
        const [lo, hi] = unit.difficulty ?? [];
        if (!(lo >= 1 && hi <= 10 && lo <= hi)) problems.push(`${uat}: difficulty must be [lo, hi] within 1–10`);
      }
    }
  });
  return problems;
}

/** One module's card file: every card's fields, text and markup, plus the module's budget. */
export function moduleProblems(loaded: Loaded, moduleSlug: string): string[] {
  const entry = loaded.files.get(moduleSlug);
  if (!entry) return [];
  if (!entry.file) return [`${entry.path}: ${entry.error ?? 'unreadable'}`];
  const c = loaded.curriculum;
  const found = c ? modulesOf(c).find((m) => m.module.slug === moduleSlug) : undefined;
  if (!found) return [`${entry.path}: "${moduleSlug}" isn't a module in curriculum.json`];
  const { tier, module } = found;
  const file = entry.file;
  const problems: string[] = [];
  const where = entry.path;
  if (file.profession !== loaded.slug) problems.push(`${where}: profession should be "${loaded.slug}"`);
  if (file.module !== moduleSlug) problems.push(`${where}: module should be "${moduleSlug}"`);
  if (file.tier !== tier.tier) problems.push(`${where}: tier should be ${tier.tier}`);
  if (!entry.path.startsWith(`cards/${tier.slug}/`)) problems.push(`${where}: belongs in cards/${tier.slug}/`);
  const cards = Array.isArray(file.cards) ? file.cards : [];
  const units = new Set(module.units.map((u) => u.slug));
  const ids = new Set<string>();

  for (const [index, card] of cards.entries()) {
    const at = `${moduleSlug} card ${index + 1} (${card.id})`;
    if (!ID.test(card.id ?? '') || card.id.length > 80) problems.push(`${at}: id must be kebab-case, at most 80 characters`);
    if (ids.has(card.id)) problems.push(`${at}: duplicate id`);
    ids.add(card.id);
    if (!units.has(card.unit)) problems.push(`${at}: unit "${card.unit}" isn't in ${moduleSlug}`);
    if (!KINDS.includes(card.kind)) problems.push(`${at}: unknown kind "${card.kind}"`);
    if (!Number.isInteger(card.difficulty) || card.difficulty < 1 || card.difficulty > 10) problems.push(`${at}: difficulty must be 1–10`);
    if (card.checkpoint !== undefined && typeof card.checkpoint !== 'boolean') problems.push(`${at}: checkpoint must be true or false`);
    if (card.retired !== undefined && typeof card.retired !== 'boolean') problems.push(`${at}: retired must be true or false`);

    const title = card.title ?? '';
    const body = card.body ?? '';
    const maxTitle = LONG_KINDS.has(card.kind) ? 1500 : 600;
    const maxBody = LONG_BODY_KINDS.has(card.kind) ? 5000 : 3000;
    if (!title.trim()) problems.push(`${at}: missing title`);
    if (title.length > maxTitle) problems.push(`${at}: title over ${maxTitle} characters`);
    if (!body.trim()) problems.push(`${at}: missing body`);
    if (body.length > maxBody) problems.push(`${at}: body over ${maxBody} characters; split it into a chain of cards`);

    const { answer: answerLine, explanation } = splitAnswer(body);
    if (!answerLine) problems.push(`${at}: the body's first line must state the answer`);
    if (answerLine.startsWith('```') || answerLine === '$$') problems.push(`${at}: the answer line must be one line, not a block`);
    if (plainText(answerLine).length > 320) problems.push(`${at}: the answer line is too long; move detail into the explanation`);
    if (!explanation) problems.push(`${at}: add an explanation after the answer line`);
    if (parseBlocks(explanation).some((block) => block.kind === 'paragraph' && block.text.length > 900)) {
      problems.push(`${at}: split the explanation into shorter paragraphs (blank lines between them)`);
    }
    for (const [label, text] of [['title', title], ['body', body]] as const) {
      problems.push(...markupProblems(`${at} ${label}`, text));
      if (parseRich(text).some((s) => s.kind === 'code' && s.block && !s.lang)) {
        problems.push(`${at} ${label}: code blocks need a language, e.g. \`\`\`c`);
      }
    }
    problems.push(...typedAnswerProblems(at, card));
    problems.push(...searchQueryProblems(at, card.searchQuery, 120));
    if (card.refs !== undefined && (!Array.isArray(card.refs) || card.refs.some((r) => typeof r !== 'string' || !r.trim()))) {
      problems.push(`${at}: refs must be a list of text`);
    }
    if (card.kind === 'landmark' && !(card.refs ?? []).some((r) => /^https:\/\//.test(r))) {
      problems.push(`${at}: landmark cards cite a source URL in refs`);
    }
    for (const ref of card.refs ?? []) {
      if (/^http:\/\//.test(ref)) problems.push(`${at}: use https for "${ref}"`);
    }
    if (card.tags !== undefined && (!Array.isArray(card.tags) || card.tags.some((t) => !ID.test(t)))) {
      problems.push(`${at}: tags must be kebab-case words`);
    }
    if (card.asOf != null && !DATE.test(card.asOf)) problems.push(`${at}: asOf must be YYYY-MM-DD`);
  }

  if (!file.partial) {
    const live = cards.filter((card) => !card.retired);
    const low = Math.floor(module.plannedCards * 0.9);
    const high = Math.ceil(module.plannedCards * 1.1);
    if (live.length < low || live.length > high) {
      problems.push(`${where}: ${live.length} live cards; the plan is ${module.plannedCards} (±10%: ${low}–${high})`);
    }
    for (const unit of module.units) {
      if (!live.some((card) => card.unit === unit.slug)) problems.push(`${where}: unit "${unit.slug}" has no cards`);
    }
    if (!live.some((card) => card.checkpoint)) problems.push(`${where}: mark 1–2 capstone cards with "checkpoint": true`);
  }
  return problems;
}

/** Word 3-grams of a card's prompt and answer, for spotting near-duplicates. */
function shingles(card: Card): Set<string> {
  const words = `${normalizedPrompt(card.title ?? '')} ${normalizedPrompt(splitAnswer(card.body ?? '').answer)}`
    .split(' ')
    .filter(Boolean);
  if (words.length < 3) return new Set([words.join(' ')]);
  const out = new Set<string>();
  for (let i = 0; i + 3 <= words.length; i++) out.add(words.slice(i, i + 3).join(' '));
  return out;
}

/** Checks across the whole profession: ids, repeated prompts, shipped ids and tier checkpoints. */
export function crossProblems(loaded: Loaded): string[] {
  const problems: string[] = [];
  const c = loaded.curriculum;
  if (!c) return problems;
  const all: { module: string; card: Card }[] = [];
  for (const [module, entry] of loaded.files) for (const card of entry.file?.cards ?? []) all.push({ module, card });

  const owner = new Map<string, string>();
  const prompts = new Map<string, string>();
  for (const { module, card } of all) {
    const other = owner.get(card.id);
    if (other && other !== module) problems.push(`${module}/${card.id}: id also used in ${other}`);
    owner.set(card.id, module);
    if (card.retired) continue;
    const prompt = normalizedPrompt(card.title ?? '');
    const same = prompts.get(prompt);
    if (same) problems.push(`${module}/${card.id}: same prompt as ${same}`);
    prompts.set(prompt, `${module}/${card.id}`);
  }

  // Near-duplicates: 90% of prompt-and-answer 3-grams shared, found through an index rather than every pair.
  const live = all.filter(({ card }) => !card.retired);
  const sets = live.map(({ card }) => shingles(card));
  const index = new Map<string, number[]>();
  sets.forEach((set, i) => {
    for (const s of set) {
      const list = index.get(s);
      if (list) list.push(i);
      else index.set(s, [i]);
    }
  });
  sets.forEach((set, i) => {
    const shared = new Map<number, number>();
    for (const s of set) for (const j of index.get(s) ?? []) if (j > i) shared.set(j, (shared.get(j) ?? 0) + 1);
    for (const [j, n] of shared) {
      const jaccard = n / (set.size + sets[j].size - n);
      if (jaccard >= 0.9) {
        problems.push(`${live[i].module}/${live[i].card.id} and ${live[j].module}/${live[j].card.id} are near-duplicates`);
      }
    }
  });

  const shippedPath = join(ROOT, loaded.slug, 'shipped-ids.json');
  if (existsSync(shippedPath)) {
    const shipped = (JSON.parse(readFileSync(shippedPath, 'utf8')) as { ids?: string[] }).ids ?? [];
    for (const id of shipped) {
      if (!owner.has(id)) problems.push(`${id}: shipped to learners, so it can't be deleted; mark it "retired": true instead`);
    }
  }

  for (const tier of c.tiers) {
    const files = tier.modules.map((m) => loaded.files.get(m.slug)?.file);
    if (!files.every((f) => f && !f.partial)) continue;
    const checkpoints = files.reduce((n, f) => n + (f?.cards.filter((card) => card.checkpoint && !card.retired).length ?? 0), 0);
    if (checkpoints < 10) problems.push(`tier ${tier.tier} (${tier.slug}): ${checkpoints} checkpoint cards; placement needs at least 10`);
  }
  return problems;
}
