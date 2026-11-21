# Study packs

Each subject lives in `content/packs/<subject>/`:

- `category.json`: `{ "id", "name", "tagline", "packs": [pack ids in display order] }`
- `<pack-id>.json`: one pack of exactly **100 cards**.

```json
{
  "id": "calc-derivatives",
  "title": "Derivative Rules",
  "course": "Calculus I",
  "description": "What the pack covers, in at most 300 characters.",
  "cards": [
    {
      "id": "quotient-rule",
      "title": "Quotient rule: $\\dfrac{d}{dx}\\left[\\dfrac{f}{g}\\right] = \\,?$",
      "body": "$\\dfrac{f'g - fg'}{g^2}$\n\n**Low d-high minus high d-low**, over the square of what's below.\n\nWhy: write $\\frac{f}{g} = f \\cdot g^{-1}$, then use the product and chain rules.\nExample: $\\dfrac{d}{dx}\\left[\\dfrac{\\sin x}{x}\\right] = \\dfrac{x\\cos x - \\sin x}{x^2}$\nWatch out: order matters in the numerator; in the product rule it doesn't.",
      "answer": "(f'g - fg')/g^2",
      "acceptedAnswers": ["(g f' - f g')/g^2"],
      "answerDisplay": "$\\dfrac{f'g - fg'}{g^2}$",
      "searchQuery": "quotient rule derivative formula"
    }
  ]
}
```

`npm run packs:build -- --out supabase/migrations/<timestamp>_<name>.sql` turns the packs into a Supabase migration.

## Cards

| Field | What it is |
| --- | --- |
| `id` | kebab-case, at most 60 characters, unique in the pack. Students' copies point at it: never rename or reuse an existing id (you may rewrite its text). |
| `title` | The front: one question with one right answer, at most 200 characters including markup. |
| `body` | The back; see "How the back is laid out". At most 1,500 characters. |
| `answer` | Optional. Makes it a typed card; see "Typed answers". |
| `acceptedAnswers` | Optional. Other typed answers that also count. |
| `answerDisplay` | Optional. The typed answer formatted for display, in markup (`$\\frac{1}{6}$`, `$\\ce{H2SO4}$`, `` `git stash` ``). Leave it out when the answer is a plain word. |
| `searchQuery` | **Required.** What the card's "Learn more on Google" link searches: 3–10 plain words naming the specific concept and answer, e.g. `quotient rule derivative formula`, `Krebs cycle location mitochondrial matrix`, `git stash save uncommitted changes`. No markup, at most 100 characters. |

## How the back is laid out

The app shows the back in this order, so write the body to match:

1. **The answer box.** The body's **first line** is the answer, short: a value, a term, a formula or one sentence. Typed cards show `answerDisplay` (or `answer`) in the box instead, so on typed cards the first line is hidden: put only the answer there.
2. **A blank line**, then the explanation in short paragraphs (one to three sentences each), with a blank line between paragraphs.
3. **Callout boxes**: a line that starts with one of these labels becomes a colored box. Use one or two per card; they're what makes a card easy to scan.
   - `Why:` the reason or derivation
   - `Example:` a quick worked example or a concrete case
   - `Watch out:` the classic mistake or trap
   - `Tip:` a shortcut or exam strategy
   - `Mnemonic:` a memory hook
   - `Key idea:` the one-line takeaway
4. **Lists**: lines starting with `- ` (or `1. ` for steps) become a bulleted or numbered list.
5. A "Learn more on Google" link built from `searchQuery`.

Use `**…**` to highlight the one to three most important terms on the back (not whole sentences).

## Typed answers

- Use them when the answer is short and unambiguous: a number, a term, an expression someone could type on a phone keyboard. Every pack needs at least 20; use more where it's natural (math, chemistry, code).
- Plain text only, at most 80 characters: no `$`, backslashes or backticks. Write math the way people type it: `x^2`, `sqrt(x)`, `pi`, `1/2`, `e^(2x)`, `-inf`, `H2SO4`.
- Checking ignores case, spaces, a leading "the/a/an" before a word, `*` and `·`, `x²` vs `x^2`, `π` vs `pi`, and how numbers are written (`1,5` = `1.5`, `.5` = `0.50`, `1,000` = `1000`). Anything else must match exactly, so list real alternatives in `acceptedAnswers`: synonyms, abbreviations, `1/2` vs `0.5`, reordered terms (`2x + 1` vs `1 + 2x`). Normalizing turns `√` into `sqrt` but adds no parentheses, so list `sqrt(3)/2` and `sqrt3/2` when both are natural.
- For numeric answers, ask for the number only and put the unit and rounding in the prompt.
- A one-letter typo in a word of five or more letters gets a free retry, not credit.

## Markup

Titles, bodies and `answerDisplay` support:

| Write | For |
| --- | --- |
| `$…$` | Inline math in LaTeX (KaTeX): `$F = ma$`, `$\\sin^2\\theta + \\cos^2\\theta = 1$`, `$\\lim_{x \\to 0}$`, `$\\int_a^b f(x)\\,dx$`, `$\\vec{v}$`, `$\\mathbb{R}^n$`, `$\\begin{pmatrix} 1 & 2 \\\\ 3 & 4 \\end{pmatrix}$` |
| `$$…$$` | A long equation on its own line |
| `$\\ce{…}$` | Chemistry (mhchem): `$\\ce{H2SO4}$`, `$\\ce{Fe^3+}$`, `$\\ce{2H2 + O2 -> 2H2O}$`, `$\\ce{CH3COOH <=> CH3COO- + H+}$` |
| `` `…` `` | Inline code: `` `git stash` ``, `` `SELECT * FROM users` `` |
| ` ```lang ` … ` ``` ` | A code block of up to 8 lines |
| `**…**` | A highlighted key term |
| `\\$` | A literal dollar sign |

- Put every formula, variable, expression and number-with-units in math: `$x$`, `$9.8\\,\\mathrm{m/s^2}$`, `$25\\,^\\circ\\mathrm{C}$`. Prose stays outside math.
- In the JSON file every backslash is doubled: `"$\\frac{a}{b}$"`, and a newline is `\n` (a blank line is `\n\n`). The examples above are written that way.
- Code identifiers, commands, keywords and short snippets go in backticks.

## Quality bar

- College level, exam-relevant and correct. Double-check every number, formula, sign, unit and definition.
- One idea per card, with prompts specific enough to have one right answer (give units and conditions).
- Mix definitions, formulas, short worked problems, conceptual "why" cards and common mistakes, ordered from fundamentals to harder material.
- No repeated prompts within a subject. American English, concise, no emoji.

## Validate

```sh
PACKS=calc-limits,calc-derivatives npx jest content --silent   # some packs, or whole subjects
npx jest content                                                 # everything
```
