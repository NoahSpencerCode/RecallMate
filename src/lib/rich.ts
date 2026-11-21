/**
 * Card text markup (see content/README.md):
 *
 *   $…$         inline math, LaTeX rendered with KaTeX (\ce{…} for chemistry)
 *   $$…$$       display math, on its own line
 *   `…`         inline code
 *   ```lang     a code block, closed by ```
 *   **…**       a highlighted key term
 *   \$          a literal dollar sign
 *
 * and, for whole lines (parseBlocks): blank lines between paragraphs,
 * "- " or "1. " list items, and callouts such as "Why: …" or "Watch out: …".
 *
 * A "$" only opens math when a non-space follows it, and only closes it when
 * a non-space precedes it and no digit follows, so "$5 or $10" stays text.
 */
export type RichSegment =
  | { kind: 'text'; text: string; strong?: boolean }
  | { kind: 'math'; tex: string; display: boolean }
  | { kind: 'code'; code: string; block: boolean; lang?: string };

/** Index of the "$" closing inline math that starts at `from`, or -1. */
function closeInlineMath(input: string, from: number): number {
  for (let i = from; i < input.length; i++) {
    const ch = input[i];
    if (ch === '\n') return -1;
    if (ch === '\\') {
      i++; // skip the escaped character (\$, \{, …)
      continue;
    }
    if (ch === '$' && i > from && !/\s/.test(input[i - 1]) && !/\d/.test(input[i + 1] ?? '')) return i;
  }
  return -1;
}

function closeDisplayMath(input: string, from: number): number {
  for (let i = from; i < input.length - 1; i++) {
    if (input[i] === '\\') {
      i++;
      continue;
    }
    if (input[i] === '$' && input[i + 1] === '$') return i;
  }
  return -1;
}

export function parseRich(input: string): RichSegment[] {
  const out: RichSegment[] = [];
  let text = '';
  let strong = false;
  const flush = () => {
    if (text) out.push(strong ? { kind: 'text', text, strong } : { kind: 'text', text });
    text = '';
  };

  for (let i = 0; i < input.length; ) {
    const ch = input[i];

    if (input.startsWith('```', i)) {
      const end = input.indexOf('```', i + 3);
      if (end !== -1) {
        let code = input.slice(i + 3, end);
        let lang: string | undefined;
        const newline = code.indexOf('\n');
        if (newline !== -1 && /^[\w+#.-]*$/.test(code.slice(0, newline).trim())) {
          lang = code.slice(0, newline).trim() || undefined;
          code = code.slice(newline + 1);
        }
        flush();
        out.push({ kind: 'code', code: code.replace(/\n$/, ''), block: true, lang });
        i = end + 3;
        if (input[i] === '\n') i++;
        continue;
      }
    }

    if (ch === '`') {
      const end = input.indexOf('`', i + 1);
      const newline = input.indexOf('\n', i + 1);
      if (end > i + 1 && (newline === -1 || end < newline)) {
        flush();
        out.push({ kind: 'code', code: input.slice(i + 1, end), block: false });
        i = end + 1;
        continue;
      }
    }

    if (ch === '\\' && input[i + 1] === '$') {
      text += '$';
      i += 2;
      continue;
    }

    // **key term**: only when the closing ** is on the same line.
    if (input.startsWith('**', i)) {
      const newline = input.indexOf('\n', i + 2);
      const close = input.indexOf('**', i + 2);
      if (strong || (close > i + 2 && (newline === -1 || close < newline))) {
        flush();
        strong = !strong;
        i += 2;
        continue;
      }
    }

    if (input.startsWith('$$', i)) {
      const end = closeDisplayMath(input, i + 2);
      if (end !== -1) {
        flush();
        out.push({ kind: 'math', tex: input.slice(i + 2, end).trim(), display: true });
        i = end + 2;
        if (input[i] === '\n') i++;
        continue;
      }
    }

    if (ch === '$' && input[i + 1] && !/\s/.test(input[i + 1])) {
      const end = closeInlineMath(input, i + 1);
      if (end !== -1) {
        flush();
        out.push({ kind: 'math', tex: input.slice(i + 1, end), display: false });
        i = end + 1;
        continue;
      }
    }

    text += ch;
    i++;
  }
  flush();
  return out;
}

/** True when the text uses any markup (math or code). */
export function hasMarkup(input: string): boolean {
  return parseRich(input).some((segment) => segment.kind !== 'text');
}

/** Readable plain text: for screen readers, search, and where math can't be typeset. */
export function plainText(input: string): string {
  return parseRich(input)
    .map((segment) => (segment.kind === 'text' ? segment.text : segment.kind === 'code' ? segment.code : texToPlain(segment.tex)))
    .join('');
}

// ---------------------------------------------------------------------------
// LaTeX → Unicode, good enough for screen readers and the native fallback.

const SUPERSCRIPT: Record<string, string> = {
  '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹',
  '+': '⁺', '-': '⁻', '−': '⁻', '=': '⁼', '(': '⁽', ')': '⁾', n: 'ⁿ', i: 'ⁱ', x: 'ˣ', y: 'ʸ', a: 'ᵃ', b: 'ᵇ',
  c: 'ᶜ', d: 'ᵈ', e: 'ᵉ', k: 'ᵏ', m: 'ᵐ', t: 'ᵗ', T: 'ᵀ', '∗': '*', '*': '*', "'": '′',
};
const SUBSCRIPT: Record<string, string> = {
  '0': '₀', '1': '₁', '2': '₂', '3': '₃', '4': '₄', '5': '₅', '6': '₆', '7': '₇', '8': '₈', '9': '₉',
  '+': '₊', '-': '₋', '−': '₋', '=': '₌', '(': '₍', ')': '₎', a: 'ₐ', e: 'ₑ', i: 'ᵢ', j: 'ⱼ', k: 'ₖ',
  n: 'ₙ', o: 'ₒ', r: 'ᵣ', t: 'ₜ', x: 'ₓ', m: 'ₘ', p: 'ₚ', s: 'ₛ', h: 'ₕ', l: 'ₗ', u: 'ᵤ', v: 'ᵥ',
};
const SYMBOLS: Record<string, string> = {
  alpha: 'α', beta: 'β', gamma: 'γ', delta: 'δ', epsilon: 'ε', varepsilon: 'ε', zeta: 'ζ', eta: 'η',
  theta: 'θ', vartheta: 'ϑ', iota: 'ι', kappa: 'κ', lambda: 'λ', mu: 'μ', nu: 'ν', xi: 'ξ', pi: 'π',
  rho: 'ρ', sigma: 'σ', tau: 'τ', upsilon: 'υ', phi: 'φ', varphi: 'φ', chi: 'χ', psi: 'ψ', omega: 'ω',
  Gamma: 'Γ', Delta: 'Δ', Theta: 'Θ', Lambda: 'Λ', Xi: 'Ξ', Pi: 'Π', Sigma: 'Σ', Phi: 'Φ', Psi: 'Ψ', Omega: 'Ω',
  cdot: '·', times: '×', div: '÷', pm: '±', mp: '∓', le: '≤', leq: '≤', ge: '≥', geq: '≥', ne: '≠', neq: '≠',
  approx: '≈', equiv: '≡', sim: '∼', cong: '≅', propto: '∝', infty: '∞', to: '→', rightarrow: '→',
  leftarrow: '←', Rightarrow: '⇒', implies: '⇒', Leftarrow: '⇐', iff: '⇔', Leftrightarrow: '⇔',
  leftrightarrow: '↔', rightleftharpoons: '⇌', mapsto: '↦', uparrow: '↑', downarrow: '↓', int: '∫', iint: '∬',
  iiint: '∭', oint: '∮', sum: '∑', prod: '∏', partial: '∂', nabla: '∇', in: '∈', notin: '∉', ni: '∋',
  subset: '⊂', subseteq: '⊆', supset: '⊃', supseteq: '⊇', cup: '∪', cap: '∩', emptyset: '∅',
  varnothing: '∅', forall: '∀', exists: '∃', neg: '¬', lnot: '¬', land: '∧', wedge: '∧', lor: '∨',
  vee: '∨', oplus: '⊕', otimes: '⊗', circ: '∘', degree: '°', angle: '∠', perp: '⊥', parallel: '∥',
  ldots: '…', cdots: '⋯', dots: '…', vdots: '⋮', hbar: 'ℏ', ell: 'ℓ', langle: '⟨', rangle: '⟩',
  lfloor: '⌊', rfloor: '⌋', lceil: '⌈', rceil: '⌉', ast: '∗', star: '⋆', top: '⊤', bot: '⊥', vdash: '⊢',
  models: '⊨', setminus: '∖', mid: '∣', nmid: '∤', triangle: '△', prime: '′', percent: '%',
  '{': '{', '}': '}', '%': '%', '&': '&', '#': '#', _: '_', '|': '‖', ',': ' ', ';': ' ', ':': ' ', '!': '',
  quad: ' ', qquad: '  ', ' ': ' ', '\\': '; ', lbrace: '{', rbrace: '}', vert: '|', Vert: '‖',
};
const BLACKBOARD: Record<string, string> = { R: 'ℝ', N: 'ℕ', Z: 'ℤ', Q: 'ℚ', C: 'ℂ', P: 'ℙ', E: '𝔼' };
const SKIP = new Set([
  'left', 'right', 'big', 'Big', 'bigg', 'Bigg', 'bigl', 'bigr', 'Bigl', 'Bigr', 'displaystyle', 'textstyle',
  'limits', 'nolimits', 'middle',
]);
const TEXTLIKE = new Set([
  'text', 'textrm', 'textit', 'textbf', 'mathrm', 'mathit', 'mathbf', 'mathsf', 'mathcal', 'operatorname',
  'boldsymbol', 'bm', 'mbox', 'overline', 'underline', 'textsf', 'texttt', 'mathtt', 'emph',
]);
const ACCENTS: Record<string, string> = { vec: '⃗', hat: '̂', bar: '̄', dot: '̇', ddot: '̈', tilde: '̃', widehat: '̂', overrightarrow: '⃗' };

class TexReader {
  private i = 0;
  constructor(private readonly s: string) {}

  done() {
    return this.i >= this.s.length;
  }

  /** One argument: a {group}, a \command, or a single character. */
  argument(): string {
    this.skipSpaces();
    const ch = this.s[this.i];
    if (ch === undefined) return '';
    if (ch === '{') return this.group();
    if (ch === '\\') return this.command();
    this.i++;
    return ch;
  }

  /** An optional [argument], e.g. the n in \sqrt[n]{x}. */
  optional(): string | null {
    this.skipSpaces();
    if (this.s[this.i] !== '[') return null;
    const end = this.s.indexOf(']', this.i);
    if (end === -1) return null;
    const inner = this.s.slice(this.i + 1, end);
    this.i = end + 1;
    return texToPlain(inner);
  }

  group(): string {
    let depth = 0;
    const start = this.i + 1;
    for (; this.i < this.s.length; this.i++) {
      const ch = this.s[this.i];
      if (ch === '\\') {
        this.i++;
        continue;
      }
      if (ch === '{') depth++;
      if (ch === '}' && --depth === 0) break;
    }
    const inner = this.s.slice(start, this.i);
    this.i++;
    return texToPlain(inner);
  }

  rawGroup(): string {
    this.skipSpaces();
    if (this.s[this.i] !== '{') return this.argument();
    let depth = 0;
    const start = this.i + 1;
    for (; this.i < this.s.length; this.i++) {
      if (this.s[this.i] === '{') depth++;
      if (this.s[this.i] === '}' && --depth === 0) break;
    }
    const inner = this.s.slice(start, this.i);
    this.i++;
    return inner;
  }

  command(): string {
    this.i++; // the backslash
    const match = /^[A-Za-z]+/.exec(this.s.slice(this.i));
    const name = match ? match[0] : (this.s[this.i] ?? '');
    this.i += name.length || 1;
    if (SKIP.has(name)) return '';
    if (name === 'frac' || name === 'dfrac' || name === 'tfrac') {
      const top = this.argument();
      const bottom = this.argument();
      return `${wrap(top)}/${wrap(bottom)}`;
    }
    if (name === 'binom') return `C(${this.argument()}, ${this.argument()})`;
    if (name === 'sqrt') {
      const index = this.optional();
      const body = this.argument();
      return `${index ? `${superscript(index) ?? index}` : ''}√${wrap(body)}`;
    }
    if (name === 'ce') return chemToPlain(this.rawGroup());
    if (name === 'pu') return this.argument();
    if (name === 'mathbb') {
      const letter = this.argument();
      return BLACKBOARD[letter] ?? letter;
    }
    if (TEXTLIKE.has(name)) return this.argument();
    if (name in ACCENTS) return `${this.argument()}${ACCENTS[name]}`;
    if (name === 'begin' || name === 'end') {
      const env = this.rawGroup();
      if (name === 'begin' && /matrix|cases|array|aligned/.test(env)) {
        if (env === 'array') this.rawGroup(); // column spec
        return env.includes('matrix') ? '[' : '';
      }
      return env.includes('matrix') ? ']' : '';
    }
    if (name in SYMBOLS) return SYMBOLS[name];
    return name; // \sin, \log, \lim, unknown commands: their name reads fine
  }

  skipSpaces() {
    while (this.s[this.i] === ' ') this.i++;
  }

  read(): string {
    let out = '';
    while (!this.done()) {
      const ch = this.s[this.i];
      if (ch === '\\') out += this.command();
      else if (ch === '{') out += this.group();
      else if (ch === '}') this.i++;
      else if (ch === '^' || ch === '_') {
        this.i++;
        const arg = this.argument();
        const mapped = ch === '^' ? superscript(arg) : subscript(arg);
        out += mapped ?? `${ch}${wrap(arg)}`;
      } else if (ch === '&') {
        out += ' ';
        this.i++;
      } else if (ch === '~') {
        out += ' ';
        this.i++;
      } else {
        out += ch;
        this.i++;
      }
    }
    return out;
  }
}

function mapAll(text: string, table: Record<string, string>): string | null {
  let out = '';
  for (const ch of text) {
    const mapped = table[ch];
    if (mapped === undefined) return null;
    out += mapped;
  }
  return out;
}

const superscript = (text: string) => mapAll(text, SUPERSCRIPT);
const subscript = (text: string) => mapAll(text, SUBSCRIPT);
const wrap = (text: string) => (/^[\w.′]+$|^[\p{L}\p{N}]$/u.test(text) ? text : `(${text})`);

export function texToPlain(tex: string): string {
  return new TexReader(tex).read().replace(/\s+/g, ' ').trim();
}

/** mhchem formulas and equations: H2SO4 → H₂SO₄, Fe^3+ → Fe³⁺, A <=> B → A ⇌ B. */
export function chemToPlain(ce: string): string {
  return ce
    .replace(/<=>|<=>>|<<=>/g, ' ⇌ ')
    .replace(/<->/g, ' ↔ ')
    .replace(/->/g, ' → ')
    .replace(/<-/g, ' ← ')
    .replace(/\^\{?([0-9]*[+-])\}?/g, (_, charge: string) => superscript(charge) ?? `^${charge}`)
    .replace(/([A-Za-z)\]])(\d+)/g, (_, before: string, digits: string) => `${before}${subscript(digits)}`)
    .replace(/([A-Za-z)\]])([+-])(?=\s|$|\))/g, (_, before: string, charge: string) => `${before}${superscript(charge)}`)
    .replace(/\s+/g, ' ')
    .trim();
}

// ---------------------------------------------------------------------------
// Block structure: what makes a long explanation easy to scan.

export type CalloutKind = 'why' | 'example' | 'watch' | 'tip' | 'mnemonic' | 'key';

export type RichBlock =
  | { kind: 'paragraph'; text: string }
  | { kind: 'callout'; callout: CalloutKind; label: string; text: string }
  | { kind: 'list'; ordered: boolean; items: string[] }
  | { kind: 'code'; code: string; lang?: string }
  | { kind: 'math'; tex: string };

/** Line prefixes that turn a paragraph into a callout box. */
export const CALLOUTS: Record<string, { kind: CalloutKind; label: string }> = {
  'Why:': { kind: 'why', label: 'Why' },
  'Example:': { kind: 'example', label: 'Example' },
  'Watch out:': { kind: 'watch', label: 'Watch out' },
  'Tip:': { kind: 'tip', label: 'Tip' },
  'Mnemonic:': { kind: 'mnemonic', label: 'Memory hook' },
  'Key idea:': { kind: 'key', label: 'Key idea' },
};
const CALLOUT_LINE = /^(Why:|Example:|Watch out:|Tip:|Mnemonic:|Key idea:)\s*/;
const BULLET = /^[-•]\s+/;
const NUMBERED = /^\d+[.)]\s+/;

/**
 * A callout's text sits on its own line under the label, so it reads as a new
 * sentence: "Key idea: the rate law…" shows "The rate law…". Words whose case
 * carries meaning (pH, mRNA, sp3, p-series, a lone variable like x) are kept.
 */
export function startSentence(text: string): string {
  const word = /^[a-z]\S*/.exec(text)?.[0];
  if (!word) return text;
  const bare = word.replace(/[,;:.!?)]+$/, '');
  const meaningfulCase = /[A-Z0-9]/.test(bare) || /^[a-z]-/.test(bare) || (bare.length === 1 && bare !== 'a');
  return meaningfulCase ? text : text[0].toUpperCase() + text.slice(1);
}

/**
 * Splits text into paragraphs, callouts, lists, code blocks and display math.
 * Each block's text still holds inline markup for parseRich.
 */
export function parseBlocks(input: string): RichBlock[] {
  const lines = input.split('\n');
  const blocks: RichBlock[] = [];
  let open: { kind: 'paragraph' | 'callout'; lines: string[]; callout?: CalloutKind; label?: string } | null = null;
  let list: { ordered: boolean; items: string[] } | null = null;

  const close = () => {
    if (open) {
      const text = open.lines.join('\n').trim();
      if (open.kind === 'callout') {
        blocks.push({ kind: 'callout', callout: open.callout!, label: open.label!, text: startSentence(text) });
      }
      else if (text) blocks.push({ kind: 'paragraph', text });
    }
    if (list) blocks.push({ kind: 'list', ordered: list.ordered, items: list.items });
    open = null;
    list = null;
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    if (trimmed.startsWith('```')) {
      const end = lines.findIndex((l, j) => j > i && l.trim().startsWith('```'));
      if (end !== -1) {
        close();
        const lang = trimmed.slice(3).trim() || undefined;
        blocks.push({ kind: 'code', code: lines.slice(i + 1, end).join('\n'), lang });
        i = end;
        continue;
      }
    }
    if (trimmed.startsWith('$$')) {
      const sameLine = trimmed.length > 4 && trimmed.endsWith('$$');
      const end = sameLine ? i : lines.findIndex((l, j) => j > i && l.includes('$$'));
      if (end !== -1) {
        close();
        const raw = sameLine ? trimmed : lines.slice(i, end + 1).join('\n').trim();
        blocks.push({ kind: 'math', tex: raw.replace(/^\$\$|\$\$$/g, '').trim() });
        i = end;
        continue;
      }
    }
    if (!trimmed) {
      close();
      continue;
    }
    const bullet = BULLET.exec(trimmed) ?? NUMBERED.exec(trimmed);
    if (bullet) {
      const ordered = NUMBERED.test(trimmed);
      // A paragraph and a list are never open together, so this only closes the paragraph.
      if (open) close();
      if (list && list.ordered !== ordered) close();
      const current: { ordered: boolean; items: string[] } = list ?? { ordered, items: [] };
      current.items.push(trimmed.slice(bullet[0].length));
      list = current;
      continue;
    }
    const callout = CALLOUT_LINE.exec(trimmed);
    if (callout) {
      close();
      const { kind, label } = CALLOUTS[callout[1]];
      open = { kind: 'callout', callout: kind, label, lines: [trimmed.slice(callout[0].length)] };
      continue;
    }
    if (list) close();
    if (!open) open = { kind: 'paragraph', lines: [] };
    open.lines.push(line);
  }
  close();
  return blocks;
}

/**
 * The back of a card: its first line states the answer, the rest explains.
 * (Typed cards show the formatted answer instead of the first line.)
 */
export function splitAnswer(body: string): { answer: string; explanation: string } {
  const newline = body.indexOf('\n');
  if (newline === -1) return { answer: body.trim(), explanation: '' };
  return { answer: body.slice(0, newline).trim(), explanation: body.slice(newline + 1).trim() };
}

/** A Google search for learning more about a card. */
export function learnMoreUrl(query: string): string {
  return `https://www.google.com/search?q=${encodeURIComponent(query.trim())}`;
}

/** A search for cards without a written query: the question, plus the answer when it's short. */
export function fallbackSearchQuery(title: string, answer?: string | null, topic?: string | null): string {
  const question = plainText(title).replace(/\s+/g, ' ').trim().slice(0, 90);
  return [question, answer && answer.length <= 30 ? answer : null, topic].filter(Boolean).join(' ');
}
