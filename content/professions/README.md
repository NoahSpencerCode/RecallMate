# Professions

A profession is one long, ordered path of cards that takes a learner who isn't
in school from zero to the knowledge of a PhD candidate in that field: someone
who has passed the qualifying exams and can read current research. Learners open
cards one at a time into their review stack; the order of this content *is* the
course.

This guide is for everyone who writes or checks profession cards, people and
agents alike. Card text uses the same markup and the same answer/explanation
layout as study packs: read [`../README.md`](../README.md) ("How the back is laid
out", "Typed answers", "Markup") first. This guide adds what's different.

## Files

```
content/professions/<profession>/
  profession.json          name, pitch, look and notation sheet
  curriculum.json          tiers → modules → units: the plan every card is written from
  blueprint.md             research notes, sources and the coverage matrix
  cards/<tier-slug>/<module>.json   one module's cards
  checks/<module>.json     the checker's verdicts for that module
  shipped-ids.json         every card id ever released (written by the builder)
```

### profession.json

```json
{
  "id": "mathematics",
  "name": "Mathematics",
  "tagline": "One line, at most 200 characters.",
  "description": "A paragraph for the profession page's About section.",
  "icon": "sigma",
  "accent": "#6C4DFF",
  "gradient": ["#7B61FF", "#B44DFF"],
  "position": 0,
  "notation": ["ℕ = {0, 1, 2, …}", "…"]
}
```

`icon` is a [MaterialCommunityIcons](https://pictogrammers.com/library/mdi/) name.
The look lives in content, so a new profession needs no app change.

### curriculum.json

Tiers (numbered from 0) contain modules, and modules contain units. Every card belongs
to one unit. Tier and module budgets are fixed; unit budgets add up to their
module's, and each unit's `kinds` add up to its budget. A tier's optional
`order` lists every unit (`"module/unit"`) in teaching order; without it,
units are taught module by module.

### A module's card file

```json
{
  "profession": "mathematics",
  "module": "real-analysis-1",
  "tier": 3,
  "partial": false,
  "cards": [
    {
      "id": "completeness-axiom",
      "unit": "completeness",
      "kind": "definition",
      "difficulty": 4,
      "checkpoint": true,
      "title": "State the **completeness axiom** of $\\mathbb{R}$.",
      "body": "Every nonempty set of real numbers that is bounded above has a least upper bound in $\\mathbb{R}$.\n\nWhy: This is what separates $\\mathbb{R}$ from $\\mathbb{Q}$: the set $\\{q \\in \\mathbb{Q} : q^2 < 2\\}$ is bounded above but has no least upper bound in $\\mathbb{Q}$.",
      "searchQuery": "completeness axiom real numbers least upper bound",
      "refs": ["Abbott, Understanding Analysis §1.3"]
    }
  ]
}
```

| Field | Rules |
| --- | --- |
| `id` | kebab-case, at most 80 characters, unique in the profession and descriptive (`dominated-convergence-theorem`, not `card-17`). Learners' progress points at it: **never rename, reuse or delete an id once shipped.** To withdraw a card, set `"retired": true` and keep it in the file. |
| `unit` | A unit slug from this module in `curriculum.json`. |
| `kind` | One of `definition`, `concept`, `theorem`, `proof-idea`, `example`, `counterexample`, `problem`, `formula`, `code`, `numbers`, `trade-off`, `landmark`, `misconception`. It shows as a tag on the card. Follow the unit's planned mix. |
| `difficulty` | 1–10 on one scale for the whole profession. Stay inside the unit's band and rise through the module. |
| `checkpoint` | `true` on 1–2 capstone cards per module: cards that prove the module was learned. Placement checks draw from these. Every tier needs at least 10. |
| `title` | The front. One precise question with one right answer. At most 600 characters (1,500 for `problem` and `code`, which carry a problem statement or a snippet). |
| `body` | The back. **The first line is the answer, on one line**: a term, a value, a formula or one sentence (inline math, or `$$…$$` on that same line). Then a blank line and the explanation. At most 3,000 characters (5,000 for `problem`, `code` and `proof-idea`). |
| `answer`, `acceptedAnswers`, `answerDisplay` | Optional, as for packs: only for short typeable answers. |
| `searchQuery` | Required: 3–10 plain words naming the concept and the answer, at most 120 characters. |
| `refs` | Pointers to a standard text or course at chapter or section level (`"Folland §2.3"`, `"MIT 6.5940 lecture 5"`). Cite a section only when you've checked it. Landmark and frontier cards also cite the source URL (https). Pointers only: never copy a sentence from a textbook. |
| `tags` | Optional kebab-case threads that recur through the path, e.g. `number-formats`, `roofline`. |
| `asOf` | `YYYY-MM-DD` on anything that can go stale: benchmark numbers, products, "current" results. |
| `partial` | `true` on a file whose module isn't finished. The checks skip its budget, and the builder leaves it out of releases unless `--allow-partial` is passed. |

## How to write profession cards

These come on top of the pack quality bar.

**One idea per card.** Depth goes in the explanation, never in a longer answer.
A result with three parts is three cards. A long proof is a chain of cards: the
statement, the key idea, then one card per step that matters.

**Teach in order.** Use only words and notation introduced earlier: in earlier
units of this module, in its prerequisites, or in earlier tiers. You get the
"terms introduced so far" list; anything not on it must be defined on a card
before it's used. Within a unit, go definition → example → property → theorem →
proof idea → problem, with difficulty climbing.

**Answer lines are for recall.** The learner should be able to say the first
line from memory. Prefer the exact statement ("$\int f_n \to \int f$ when …")
over prose about it. Make quantifiers and hypotheses explicit: they're what
graduate exams test.

**Explanations are for understanding.** Each should give one of: why it's true
(the key idea of the proof), why it matters (what it's used for), a worked
example, or the classic trap. Use the callouts (`Why:`, `Why it matters:`,
`Why it works:`, `Key idea:`, `Example:`, `Watch out:`, `Tip:`, `Mnemonic:`),
each at the start of its own paragraph, and keep paragraphs short.

**Notation.** Follow the profession's notation sheet exactly, so a symbol means
the same thing on every card.

**Kinds that need extra care**

- `theorem`: the full statement with every hypothesis, then why it matters or
  the key idea of the proof. Name the theorem in the prompt.
- `proof-idea`: one sentence for the idea, then the 3–6 steps. Not a full proof.
- `problem`: a qualifying-exam-style problem on the front; the back's first
  line is the result or the key move; the explanation is a worked outline.
  Every claim in a solution must be checkable.
- `counterexample`: the object, on the answer line, and why it breaks the claim.
- `code`: a complete, compilable snippet (C, C++, Python, CUDA, Verilog…) in a
  fenced block with its language, at most 15 lines, with assumptions stated
  (e.g. 32-bit `int`, little-endian). Ask what it prints, what's wrong, or what
  to fill in.
- `numbers`: a quantity worth knowing by heart, with units, the conditions it
  holds under (process node, precision, year) and its source.
- `trade-off`: a design choice; the answer names the winner *under stated
  conditions*, and the explanation gives the other side.
- `landmark`: who, when and what was shown, with the paper's URL in `refs`. On
  frontier cards, also say whether it's peer-reviewed, a preprint, disputed or
  a vendor claim, and set `asOf`.
- `misconception`: state the wrong belief in the prompt ("Why is … false?") and
  correct it on the answer line.

**Never invent anything.** No made-up theorem names, numbers, citations or
dates. If you can't verify something, leave it out. Landmark and frontier cards
are written with a web search open.

**Typed answers.** Use them for short, unambiguous answers (a number, a term, a
dimension), at most one card in five. Most profession cards are flip cards.

## Checking

Every module is checked by someone other than its writer. For each card, the
checker rules on:

1. Is it correct, with every hypothesis and sign right?
2. Does the answer line actually answer the prompt, and only one answer fits?
3. Is it clear, with no ambiguity?
4. Does it use anything not taught yet?
5. Is the difficulty right for where it sits?
6. Does it repeat another card?

The verdict for each card is `ok`, `fixed` (with the correction applied in the
card file) or `dropped` (then retire it if it shipped, or remove it if it
didn't). Verdicts go in `checks/<module>.json`:

```json
{ "module": "real-analysis-1", "checker": "…", "verdicts": [{ "id": "…", "verdict": "fixed", "note": "Missing hypothesis: g must be integrable." }] }
```

## Commands

```sh
MODULE=real-analysis-1 npx jest curriculum.mathematics     # check one module (seconds)
npx jest curriculum                                        # check everything
npm run professions:stats -- mathematics                   # written vs plan, kind mix, difficulty
npm run professions:sample -- mathematics --count 40       # random cards for a spot check
npm run professions:build -- --profession mathematics --tiers 0 --out supabase/migrations/<timestamp>_mathematics_t0.sql
```

Builds upsert the profession, every tier and every module, then the chosen
tiers' cards. Cards missing from the content are retired, never deleted. Add
`--changed-since <git-ref>` to emit only changed cards (for typo fixes), and
`--release` when the migration will ship, which records its ids in
`shipped-ids.json`. Card positions are `tier × 1,000,000 + order within the
tier`, so each tier's migration stands alone.
