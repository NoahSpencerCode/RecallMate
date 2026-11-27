/// <reference types="node" />
/**
 * Writing rules shared by the content checks for study packs
 * (src/features/packs/__tests__/content.test.ts) and professions
 * (src/features/professions/__tests__/curriculum.*.test.ts). Test-only: the
 * app never imports this, so KaTeX's server renderer stays out of the bundle.
 */
import { normalizeAnswer } from '@/features/review/answerMatch';
import { parseRich, plainText } from '@/lib/rich';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const katex = require('katex') as typeof import('katex').default;
// eslint-disable-next-line @typescript-eslint/no-require-imports
require('katex/contrib/mhchem');

/** Kebab-case ids, as used for packs, cards, modules and professions. */
export const ID = /^[a-z0-9]+(-[a-z0-9]+)*$/;

// The same formula shows up on many cards, so compile each one once.
const compiled = new Map<string, string | null>();

function compileError(tex: string, display: boolean): string | null {
  const key = `${display ? 'D' : 'I'}${tex}`;
  if (compiled.has(key)) return compiled.get(key) ?? null;
  let error: string | null = null;
  try {
    katex.renderToString(tex, { throwOnError: true, displayMode: display, strict: 'ignore' });
  } catch (e) {
    error = (e as Error).message.split('\n')[0];
  }
  compiled.set(key, error);
  return error;
}

/** Problems with one piece of marked-up text (a title, body or answerDisplay). */
export function markupProblems(where: string, text: string): string[] {
  const problems: string[] = [];
  for (const segment of parseRich(text)) {
    if (segment.kind === 'math') {
      const error = compileError(segment.tex, segment.display);
      if (error) problems.push(`${where}: math doesn't compile: $${segment.tex}$ (${error})`);
    } else if (segment.kind === 'text') {
      if (segment.text.includes('$')) problems.push(`${where}: stray "$" (close the math, or write \\$ for a dollar sign)`);
      if (segment.text.includes('`')) problems.push(`${where}: stray backtick (close the code span)`);
      if (segment.text.includes('**')) problems.push(`${where}: stray "**" (close the highlight on the same line)`);
    }
  }
  return problems;
}

/** A typed answer must be short, plain and typeable. */
export function plainAnswerProblems(where: string, value: unknown): string[] {
  if (typeof value !== 'string' || !value.trim()) return [`${where}: must be non-empty text`];
  const problems: string[] = [];
  if (value.length > 80) problems.push(`${where}: over 80 characters, too long to type`);
  if (/[$`\\]/.test(value)) problems.push(`${where}: must be plain typeable text (no $, \\ or backticks): ${value}`);
  if (!normalizeAnswer(value)) problems.push(`${where}: normalizes to nothing: ${value}`);
  return problems;
}

/** Problems with a typed card's answer, accepted answers and display form. */
export function typedAnswerProblems(
  at: string,
  card: { answer?: unknown; acceptedAnswers?: unknown[]; answerDisplay?: unknown },
): string[] {
  const problems: string[] = [];
  const hasAnswer = card.answer !== undefined && card.answer !== null;
  if (hasAnswer) {
    problems.push(...plainAnswerProblems(`${at} answer`, card.answer));
    const seen = new Set([normalizeAnswer(String(card.answer))]);
    for (const alt of card.acceptedAnswers ?? []) {
      problems.push(...plainAnswerProblems(`${at} acceptedAnswers`, alt));
      const normalized = normalizeAnswer(String(alt));
      if (seen.has(normalized)) problems.push(`${at}: accepted answer "${String(alt)}" is the same as another after normalizing`);
      seen.add(normalized);
    }
    if (card.answerDisplay !== undefined && card.answerDisplay !== null) {
      problems.push(...markupProblems(`${at} answerDisplay`, String(card.answerDisplay)));
    }
  } else if ((card.acceptedAnswers?.length ?? 0) > 0 || (card.answerDisplay !== undefined && card.answerDisplay !== null)) {
    problems.push(`${at}: acceptedAnswers/answerDisplay need an answer`);
  }
  return problems;
}

/** The "Learn more on Google" query: plain words naming the concept and answer. */
export function searchQueryProblems(at: string, query: unknown, maxLength = 100): string[] {
  if (typeof query !== 'string' || !query.trim()) return [`${at}: missing searchQuery`];
  if (query.length > maxLength || /[$`\\*]/.test(query) || query.trim().split(/\s+/).length < 2) {
    return [`${at}: searchQuery must be 2+ plain words, at most ${maxLength} characters: ${query}`];
  }
  return [];
}

/** A card's prompt reduced to plain lower-case words, for spotting repeats. */
export function normalizedPrompt(title: string): string {
  return plainText(title).toLowerCase().replace(/\s+/g, ' ').trim();
}
