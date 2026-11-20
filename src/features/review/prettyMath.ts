const SUPERSCRIPT: Record<string, string> = {
  '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹',
  n: 'ⁿ', '-': '⁻',
};

const GREEK: Record<string, string> = {
  pi: 'π', theta: 'θ', rho: 'ρ', phi: 'φ', mu: 'μ', lambda: 'λ', omega: 'ω', alpha: 'α', sigma: 'σ',
};

/**
 * Display-only prettifier for typed answers, which are stored in ASCII:
 * "1/(2sqrt(x))" → "1/(2√x)", "sec^2 x" → "sec² x", "O(n^2)" → "O(n²)".
 * Deliberately conservative: anything that could change meaning when
 * rewritten (x^(n), x^1/2, sqrt(2gh)) is left exactly as typed.
 */
export function prettyMath(text: string): string {
  return text
    .replace(/sqrt\(([0-9]+|[A-Za-z])\)/g, '√$1') // sqrt(3) → √3, sqrt(x) → √x
    .replace(/sqrt\(/g, '√(') // sqrt(2gh) → √(2gh)
    .replace(/\^(-?[0-9n])(?![0-9A-Za-z/.(])/g, (_, exponent: string) =>
      [...exponent].map((ch) => SUPERSCRIPT[ch] ?? ch).join(''),
    )
    .replace(/\b(pi|theta|rho|phi|mu|lambda|omega|alpha|sigma)\b/g, (word: string) => GREEK[word] ?? word)
    .replace(/\*/g, (star: string, offset: number, whole: string) =>
      offset > 0 && /\S/.test(whole[offset - 1]) && /\S/.test(whole[offset + 1] ?? ' ') ? '·' : star,
    );
}
