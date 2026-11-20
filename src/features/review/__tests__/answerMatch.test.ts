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

  it('keeps a leading "a" that is part of a formula', () => {
    expect(normalizeAnswer('A = πr²')).toBe('a=pir^2');
    expect(checkAnswer('A=πr²', 'A = πr²')).toBe('correct');
    expect(checkAnswer('a+bi', 'a + bi')).toBe('correct');
    expect(checkAnswer('the 1st law', '1st law')).toBe('correct');
    expect(checkAnswer('an enzyme', 'enzyme')).toBe('correct');
  });

  it('accepts the same number written differently', () => {
    expect(checkAnswer('1,5', '1.5')).toBe('correct');
    expect(checkAnswer('.5', '0.5')).toBe('correct');
    expect(checkAnswer('0.50', '0.5')).toBe('correct');
    expect(checkAnswer('2.0', '2')).toBe('correct');
    expect(checkAnswer('1,000 J', '1000 J')).toBe('correct');
    expect(checkAnswer('x = 2.50', 'x=2.5')).toBe('correct');
  });

  it('leaves lists and dotted numbers alone', () => {
    expect(normalizeAnswer('1, 1, 2, 3, 5')).toBe('1,1,2,3,5');
    expect(normalizeAnswer('192.168.0.10')).toBe('192.168.0.10');
    expect(checkAnswer('1.5', '15')).toBe('wrong');
    expect(checkAnswer('0.05', '0.5')).toBe('wrong');
  });
});
