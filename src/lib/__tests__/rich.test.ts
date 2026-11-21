import { describe, expect, it } from '@jest/globals';

import {
  chemToPlain,
  fallbackSearchQuery,
  learnMoreUrl,
  parseBlocks,
  parseRich,
  plainText,
  splitAnswer,
  startSentence,
  texToPlain,
} from '../rich';

describe('parseRich', () => {
  it('splits text, inline math and inline code', () => {
    expect(parseRich('If $f(x)=x^2$, run `f(3)`.')).toEqual([
      { kind: 'text', text: 'If ' },
      { kind: 'math', tex: 'f(x)=x^2', display: false },
      { kind: 'text', text: ', run ' },
      { kind: 'code', code: 'f(3)', block: false },
      { kind: 'text', text: '.' },
    ]);
  });

  it('reads display math and code blocks', () => {
    expect(parseRich('Area:\n$$\\int_0^1 x\\,dx$$\nDone')).toEqual([
      { kind: 'text', text: 'Area:\n' },
      { kind: 'math', tex: '\\int_0^1 x\\,dx', display: true },
      { kind: 'text', text: 'Done' },
    ]);
    expect(parseRich('```sql\nSELECT 1;\n```')).toEqual([{ kind: 'code', code: 'SELECT 1;', block: true, lang: 'sql' }]);
  });

  it('leaves prices and escaped dollars as text', () => {
    expect(parseRich('It costs $5 or $10.')).toEqual([{ kind: 'text', text: 'It costs $5 or $10.' }]);
    expect(parseRich('Pay \\$20 now')).toEqual([{ kind: 'text', text: 'Pay $20 now' }]);
  });

  it('keeps dollar signs inside code literal', () => {
    expect(parseRich('In bash, `echo $HOME` prints it.')[1]).toEqual({ kind: 'code', code: 'echo $HOME', block: false });
  });
});

describe('plain text', () => {
  it('turns common LaTeX into readable Unicode', () => {
    expect(texToPlain('\\frac{1}{2\\sqrt{x}}')).toBe('1/(2√x)');
    expect(texToPlain('x^2 + y^{n-1}')).toBe('x² + yⁿ⁻¹');
    expect(texToPlain('\\lim_{x \\to 0} \\frac{\\sin x}{x}')).toBe('lim_(x → 0) (sin x)/x');
    expect(texToPlain('\\alpha \\le \\beta')).toBe('α ≤ β');
    expect(texToPlain('\\mathbb{R}^n')).toBe('ℝⁿ');
  });

  it('formats chemistry', () => {
    expect(chemToPlain('H2SO4')).toBe('H₂SO₄');
    expect(chemToPlain('Fe^3+')).toBe('Fe³⁺');
    expect(chemToPlain('2H2 + O2 -> 2H2O')).toBe('2H₂ + O₂ → 2H₂O');
    expect(chemToPlain('CH3COOH <=> CH3COO- + H+')).toBe('CH₃COOH ⇌ CH₃COO⁻ + H⁺');
  });

  it('reads whole cards', () => {
    expect(plainText('Balance $\\ce{H2 + O2 -> H2O}$ with `coefficients`.')).toBe(
      'Balance H₂ + O₂ → H₂O with coefficients.',
    );
  });
});

describe('highlights and blocks', () => {
  it('marks **key terms**', () => {
    expect(parseRich('The **mitochondria** makes ATP')).toEqual([
      { kind: 'text', text: 'The ' },
      { kind: 'text', text: 'mitochondria', strong: true },
      { kind: 'text', text: ' makes ATP' },
    ]);
    expect(plainText('**bold** move')).toBe('bold move');
  });

  it('splits paragraphs, callouts, lists, code and math', () => {
    const body = [
      'First paragraph',
      'still the first.',
      '',
      'Why: because it is.',
      'Watch out: sign errors.',
      '- one',
      '- two',
      '1. first step',
      '```python',
      'print(1)',
      '```',
      '$$\\int_0^1 x\\,dx$$',
      'Last.',
    ].join('\n');
    expect(parseBlocks(body)).toEqual([
      { kind: 'paragraph', text: 'First paragraph\nstill the first.' },
      { kind: 'callout', callout: 'why', label: 'Why', text: 'Because it is.' },
      { kind: 'callout', callout: 'watch', label: 'Watch out', text: 'Sign errors.' },
      { kind: 'list', ordered: false, items: ['one', 'two'] },
      { kind: 'list', ordered: true, items: ['first step'] },
      { kind: 'code', code: 'print(1)', lang: 'python' },
      { kind: 'math', tex: '\\int_0^1 x\\,dx' },
      { kind: 'paragraph', text: 'Last.' },
    ]);
  });

  it('starts callout text as a sentence without changing case that matters', () => {
    expect(startSentence("don't divide by zero")).toBe("Don't divide by zero");
    expect(startSentence('a common slip')).toBe('A common slip');
    for (const kept of ['pH rises', 'mRNA is read', 'sp3 carbons', 'p-series converge', 'x is free', '$x$ is free']) {
      expect(startSentence(kept)).toBe(kept);
    }
  });

  it('separates the answer line from the explanation', () => {
    expect(splitAnswer('$\\frac{1}{6}$\n\nMultiply by the conjugate.')).toEqual({
      answer: '$\\frac{1}{6}$',
      explanation: 'Multiply by the conjugate.',
    });
  });

  it('builds Google links', () => {
    expect(learnMoreUrl('quotient rule derivative')).toBe('https://www.google.com/search?q=quotient%20rule%20derivative');
    expect(fallbackSearchQuery('What is $\\ce{H2O}$?', 'water', 'Chemistry')).toBe('What is H₂O? water Chemistry');
  });
});
