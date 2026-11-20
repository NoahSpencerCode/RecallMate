/**
 * Typed-answer checking. Forgiving about formatting, strict about meaning:
 * case, spacing, "*" vs "·", π vs pi, x² vs x^2 and a leading "the" don't
 * matter, but anything else does. A one-letter slip in a word answer is
 * reported as "close" (the student gets a free retry) rather than accepted,
 * because many science terms differ by one letter (amide/amine,
 * afferent/efferent, ketone/ketose).
 *
 * The pack validator (scratch tooling) mirrors normalizeAnswer; keep in sync.
 */

const SUPERSCRIPTS: Record<string, string> = {
  '⁰': '0', '¹': '1', '²': '2', '³': '3', '⁴': '4', '⁵': '5', '⁶': '6',
  '⁷': '7', '⁸': '8', '⁹': '9', '⁺': '+', '⁻': '-', '⁽': '(', '⁾': ')',
  'ⁿ': 'n', 'ˣ': 'x', 'ᵢ': 'i',
};

const REPLACEMENTS: [string, string][] = [
  ['−', '-'], ['–', '-'], ['—', '-'], ['×', ''], ['·', ''], ['⋅', ''],
  ['÷', '/'], ['π', 'pi'], ['√', 'sqrt'], ['θ', 'theta'], ['∞', 'inf'],
  ['infinity', 'inf'], ['⁄', '/'], ['’', "'"], ['‘', "'"], ['“', '"'], ['”', '"'],
];

export function normalizeAnswer(text: string): string {
  const lower = text.trim().toLowerCase();

  // Runs of superscripts become ^x or ^(xy): x² → x^2, xⁿ⁻¹ → x^(n-1).
  let out = '';
  for (let i = 0; i < lower.length; ) {
    if (lower[i] in SUPERSCRIPTS) {
      let run = '';
      while (i < lower.length && lower[i] in SUPERSCRIPTS) {
        run += SUPERSCRIPTS[lower[i]];
        i++;
      }
      out += run.length === 1 ? `^${run}` : `^(${run})`;
    } else {
      out += lower[i];
      i++;
    }
  }

  let s = out.normalize('NFKC').replaceAll('**', '^');
  for (const [from, to] of REPLACEMENTS) s = s.replaceAll(from, to);
  return s
    .replaceAll('*', '')
    .replace(/^(the|a|an)\s+/, '')
    .replace(/\s+/g, '')
    .replace(/\.+$/, '');
}

/** Optimal-string-alignment distance (a swap of neighbours counts as 1). */
export function editDistance(a: string, b: string): number {
  const rows = a.length + 1;
  const cols = b.length + 1;
  const d: number[][] = Array.from({ length: rows }, (_, i) =>
    Array.from({ length: cols }, (_, j) => (i === 0 ? j : j === 0 ? i : 0)),
  );
  for (let i = 1; i < rows; i++) {
    for (let j = 1; j < cols; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost);
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
        d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
      }
    }
  }
  return d[a.length][b.length];
}

export type AnswerVerdict = 'correct' | 'close' | 'wrong';

export function checkAnswer(
  input: string,
  answer: string | null,
  acceptedAnswers: readonly string[] = [],
): AnswerVerdict {
  const given = normalizeAnswer(input);
  if (!given || !answer) return 'wrong';

  const targets = [answer, ...acceptedAnswers].map(normalizeAnswer).filter(Boolean);
  if (targets.includes(given)) return 'correct';

  const isWord = (s: string) => /^[a-z]+$/.test(s);
  const close = targets.some(
    (target) =>
      isWord(target) && isWord(given) && target.length >= 5 && editDistance(target, given) === 1,
  );
  return close ? 'close' : 'wrong';
}
