import { describe, expect, it } from '@jest/globals';

import { checkAnswer, editDistance, normalizeAnswer } from '../answerMatch';

describe('normalizeAnswer', () => {
  it.each([
    ['  The Mitochondria. ', 'mitochondria'],
    ['xⁿ⁻¹', 'x^(n-1)'],
    ['x²', 'x^2'],
    ['x**2', 'x^2'],
    ['√x · π', 'sqrtxpi'],
    ['cos θ', 'costheta'],
    ['−1/2', '-1/2'],
    ['½', '1/2'],
    ['O(n log n)', 'o(nlogn)'],
    ['git switch -c', 'gitswitch-c'],
  ])('%s → %s', (input, expected) => {
    expect(normalizeAnswer(input)).toBe(expected);
  });
});

describe('editDistance', () => {
  it('counts a swap of neighbours as one edit', () => {
    expect(editDistance('mitochondria', 'mitochondira')).toBe(1);
  });
  it('counts substitutions and insertions', () => {
    expect(editDistance('kitten', 'sitting')).toBe(3);
    expect(editDistance('', 'abc')).toBe(3);
  });
});

describe('checkAnswer', () => {
  it('accepts formatting differences', () => {
    expect(checkAnswer('N X^(N-1)', 'nx^(n-1)')).toBe('correct');
    expect(checkAnswer('cos(x)', 'cos x', ['cos(x)'])).toBe('correct');
    expect(checkAnswer('the Golgi apparatus', 'Golgi apparatus')).toBe('correct');
  });

  it('flags one-letter slips as close instead of accepting them', () => {
    expect(checkAnswer('mitochondira', 'mitochondria')).toBe('close');
    expect(checkAnswer('amine', 'amide')).toBe('close');
  });

  it('rejects different answers', () => {
    expect(checkAnswer('O(n)', 'O(log n)', ['log n'])).toBe('wrong');
    expect(checkAnswer('exothermic', 'endothermic')).toBe('wrong');
    expect(checkAnswer('', 'anything')).toBe('wrong');
    expect(checkAnswer('anything', null)).toBe('wrong');
  });

  it('does not treat short words as close', () => {
    expect(checkAnswer('axon', 'exon')).toBe('wrong');
  });
});
