/// <reference types="node" />
/**
 * Validates the study packs in content/packs (see content/README.md).
 *
 *   npx jest packs/__tests__/content            # every pack
 *   PACKS=calc-limits,biology npx jest content  # some packs or whole subjects
 */
import { describe, expect, it } from '@jest/globals';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

import { normalizeAnswer } from '@/features/review/answerMatch';
import { parseBlocks, parseRich, plainText, splitAnswer } from '@/lib/rich';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const katex = require('katex') as typeof import('katex').default;
// eslint-disable-next-line @typescript-eslint/no-require-imports
require('katex/contrib/mhchem');

const ROOT = join(__dirname, '..', '..', '..', '..', 'content', 'packs');
const CARDS_PER_PACK = 100;
const MIN_TYPED = 20;
const ID = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const only = (process.env.PACKS ?? '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

type Card = {
  id: string;
  title: string;
  body: string;
  answer?: string;
  acceptedAnswers?: string[];
  answerDisplay?: string;
  searchQuery?: string;
};
type Pack = { id: string; title: string; course: string; description: string; cards: Card[] };
type Category = { id: string; name: string; tagline: string; packs: string[] };

const categories: Category[] = readdirSync(ROOT, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => JSON.parse(readFileSync(join(ROOT, entry.name, 'category.json'), 'utf8')) as Category);

const selected = categories.flatMap((category) =>
  category.packs
    .filter((packId) => !only.length || only.includes(packId) || only.includes(category.id))
    .map((packId) => ({ category, packId })),
);

/** Problems with one piece of marked-up text (a title, body or answerDisplay). */
function markupProblems(where: string, text: string): string[] {
  const problems: string[] = [];
  for (const segment of parseRich(text)) {
    if (segment.kind === 'math') {
      try {
        katex.renderToString(segment.tex, { throwOnError: true, displayMode: segment.display, strict: 'ignore' });
      } catch (error) {
        problems.push(`${where}: math doesn't compile: $${segment.tex}$ (${(error as Error).message.split('\n')[0]})`);
      }
    } else if (segment.kind === 'text') {
      if (segment.text.includes('$')) problems.push(`${where}: stray "$" (close the math, or write \\$ for a dollar sign)`);
      if (segment.text.includes('`')) problems.push(`${where}: stray backtick (close the code span)`);
      if (segment.text.includes('**')) problems.push(`${where}: stray "**" (close the highlight on the same line)`);
    }
  }
  return problems;
}

function plainAnswerProblems(where: string, value: unknown): string[] {
  if (typeof value !== 'string' || !value.trim()) return [`${where}: must be non-empty text`];
  const problems: string[] = [];
  if (value.length > 80) problems.push(`${where}: over 80 characters, too long to type`);
  if (/[$`\\]/.test(value)) problems.push(`${where}: must be plain typeable text (no $, \\ or backticks): ${value}`);
  if (!normalizeAnswer(value)) problems.push(`${where}: normalizes to nothing: ${value}`);
  return problems;
}

function packProblems(category: Category, packId: string): string[] {
  const file = join(ROOT, category.id, `${packId}.json`);
  if (!existsSync(file)) return [`missing file content/packs/${category.id}/${packId}.json`];
  let pack: Pack;
  try {
    pack = JSON.parse(readFileSync(file, 'utf8')) as Pack;
  } catch (error) {
    return [`invalid JSON: ${(error as Error).message}`];
  }

  const problems: string[] = [];
  if (pack.id !== packId) problems.push(`pack id "${pack.id}" should be "${packId}"`);
  for (const key of ['title', 'course', 'description'] as const) {
    if (!pack[key]?.trim()) problems.push(`missing ${key}`);
  }
  if ((pack.description ?? '').length > 300) problems.push('description over 300 characters');
  const cards = Array.isArray(pack.cards) ? pack.cards : [];
  if (cards.length !== CARDS_PER_PACK) problems.push(`has ${cards.length} cards, needs exactly ${CARDS_PER_PACK}`);

  const ids = new Set<string>();
  const prompts = new Map<string, string>();
  let typed = 0;
  for (const [index, card] of cards.entries()) {
    const at = `card ${index + 1} (${card.id})`;
    if (!ID.test(card.id ?? '') || card.id.length > 60) problems.push(`${at}: id must be kebab-case, at most 60 characters`);
    if (ids.has(card.id)) problems.push(`${at}: duplicate id`);
    ids.add(card.id);

    if (!card.title?.trim()) problems.push(`${at}: missing title`);
    if ((card.title ?? '').length > 200) problems.push(`${at}: title over 200 characters (markup included)`);
    if (!card.body?.trim()) problems.push(`${at}: missing body`);
    if ((card.body ?? '').length > 1500) problems.push(`${at}: body over 1500 characters; keep cards bite-sized`);
    const { answer: answerLine, explanation } = splitAnswer(card.body ?? '');
    if (!answerLine) problems.push(`${at}: the body's first line must state the answer`);
    if (!explanation) problems.push(`${at}: add an explanation after the answer line`);
    if (parseBlocks(explanation).some((block) => block.kind === 'paragraph' && block.text.length > 600)) {
      problems.push(`${at}: split the explanation into shorter paragraphs (blank lines between them)`);
    }

    const query = card.searchQuery;
    if (typeof query !== 'string' || !query.trim()) problems.push(`${at}: missing searchQuery`);
    else if (query.length > 100 || /[$`\\*]/.test(query) || query.trim().split(/\s+/).length < 2) {
      problems.push(`${at}: searchQuery must be 2+ plain words, at most 100 characters: ${query}`);
    }
    problems.push(...markupProblems(`${at} title`, card.title ?? ''), ...markupProblems(`${at} body`, card.body ?? ''));

    const prompt = plainText(card.title ?? '').toLowerCase().replace(/\s+/g, ' ').trim();
    if (prompts.has(prompt)) problems.push(`${at}: same prompt as ${prompts.get(prompt)}`);
    prompts.set(prompt, card.id);

    if (card.answer !== undefined) {
      typed++;
      problems.push(...plainAnswerProblems(`${at} answer`, card.answer));
      const seen = new Set([normalizeAnswer(String(card.answer))]);
      for (const alt of card.acceptedAnswers ?? []) {
        problems.push(...plainAnswerProblems(`${at} acceptedAnswers`, alt));
        const normalized = normalizeAnswer(String(alt));
        if (seen.has(normalized)) problems.push(`${at}: accepted answer "${alt}" is the same as another after normalizing`);
        seen.add(normalized);
      }
      if (card.answerDisplay !== undefined) problems.push(...markupProblems(`${at} answerDisplay`, card.answerDisplay));
    } else if (card.acceptedAnswers?.length || card.answerDisplay !== undefined) {
      problems.push(`${at}: acceptedAnswers/answerDisplay need an answer`);
    }
  }
  if (cards.length && typed < MIN_TYPED) problems.push(`only ${typed} typed answers; aim for at least ${MIN_TYPED}`);
  return problems;
}

describe('study packs', () => {
  it.each(selected.map(({ category, packId }) => [`${category.id}/${packId}`, category, packId] as const))(
    '%s',
    (_, category, packId) => {
      expect(packProblems(category, packId)).toEqual([]);
    },
  );

  it('has no repeated prompts across a subject', () => {
    const problems: string[] = [];
    for (const category of categories) {
      if (only.length && !only.includes(category.id)) continue;
      const seen = new Map<string, string>();
      for (const packId of category.packs) {
        const file = join(ROOT, category.id, `${packId}.json`);
        if (!existsSync(file)) continue;
        const pack = JSON.parse(readFileSync(file, 'utf8')) as Pack;
        for (const card of pack.cards ?? []) {
          const prompt = plainText(card.title ?? '').toLowerCase().replace(/\s+/g, ' ').trim();
          const other = seen.get(prompt);
          if (other && !other.startsWith(`${packId}/`)) problems.push(`${packId}/${card.id} repeats ${other}`);
          seen.set(prompt, `${packId}/${card.id}`);
        }
      }
    }
    expect(problems).toEqual([]);
  });
});
