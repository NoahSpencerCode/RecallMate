import { describe, expect, it } from '@jest/globals';

import { prettyMath } from '../prettyMath';

describe('prettyMath', () => {
  it.each([
    ['1/(2sqrt(x))', '1/(2√x)'],
    ['sec^2 x', 'sec² x'],
    ['O(n^2)', 'O(n²)'],
    ['-sqrt(3)/3', '-√3/3'],
    ['sqrt(2gh)', '√(2gh)'],
    ['2*pi*sqrt(m/k)', '2·π·√(m/k)'],
    ['rho^2 sin phi', 'ρ² sin φ'],
    ['O(alpha(n))', 'O(α(n))'],
  ])('prettifies %s → %s', (input, expected) => {
    expect(prettyMath(input)).toBe(expected);
  });

  it.each([
    'nx^(n-1)', // exponent is an expression
    'f^(n)(a)/n!', // nth derivative, not a power
    'x^(-1/2)',
    '1.0x10^-14',
    'x^1/2', // ambiguous
    'git stash',
    'pivot',
    'Golgi apparatus',
  ])('leaves %s alone', (input) => {
    expect(prettyMath(input)).toBe(input);
  });
});
