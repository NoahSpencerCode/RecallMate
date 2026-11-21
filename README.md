<p align="center">
  <img src="assets/images/icon.png" width="96" alt="RecallMate icon" />
</p>

# RecallMate

**Remember everything you study.** RecallMate is a spaced-repetition study app for college students. Each card comes back right before you'd forget it, on a Fibonacci schedule, so a few minutes a day turns into knowledge you keep.

As people lean more on search engines and AI for answers, the ability to recall information fades. Remembering is faster and less mentally taxing than re-researching the same thing over and over. RecallMate makes recall a daily habit.

Runs on iOS, Android and the web from one Expo codebase. Web: https://recallmate.netlify.app

## Features

- **Fibonacci scheduling.** A new card is due the next day; each correct review pushes it further out: 1, 1, 2, 3, 5, 8, 13… days. A miss resets it to tomorrow. Due dates are calendar days in your own timezone, so a card due today is reviewable all day.
- **Typed-answer checking.** Cards can require an exact answer. You get 3 tries (with a shake on each miss); a one-letter slip earns a free retry instead of a strike. Formatting doesn't matter (`x²` = `x^2`, `π` = `pi`, case and spacing are ignored), meaning does.
- **59 study packs of 100 cards (5,900 in all)** written for college courses across 16 subjects: Calculus, Trigonometry, Linear Algebra, Differential Equations, Biology, Anatomy & Physiology, Microbiology, Engineering, Software, Machine Learning, Discrete Math, Chemistry, Organic Chemistry, Biochemistry, Physics and Statistics. Math and chemistry are typeset like a textbook (KaTeX) and code is set in a monospace font. Adding a pack drip-feeds new cards (5 or 10 a day, or all at once) so reviews never pile up.
- **Library** with instant search and filters by status (due, new, learning, mastered) and source. Every card is editable.
- **Progress**: daily streaks, 30-day accuracy, a 12-week activity heatmap, a 7-day forecast and your card mix.
- **Bold, animated UI**: chunky tactile buttons, 3D card flips, confetti, springy layout transitions, light and dark themes, and a desktop sidebar layout. Respects the system's reduce-motion setting.
- **Accounts** with persistent sessions, password reset by email, and in-app account deletion.

## Tech stack

| Layer | Choice |
| --- | --- |
| App | Expo SDK 58, React Native 0.88, React 19 (React Compiler on), TypeScript |
| Navigation | Expo Router (file-based routes in `src/app`, protected route groups) |
| Animation | Reanimated 4, react-native-svg, expo-linear-gradient, expo-haptics |
| Data | Supabase (Postgres + Auth), TanStack Query for caching |
| Security | Postgres Row Level Security: users can only ever read or change their own cards and reviews |
| Tests | Jest (scheduling, dates, answer matching), pgTAP (RLS, scheduler, packs, stats) |

## Getting started

Requirements: Node 22+ and Docker (Docker Desktop, Colima or OrbStack) for the local Supabase stack.

```bash
npm install
npm run db:start          # local Supabase: Postgres, Auth and a mail catcher
cp .env.example .env.local  # then paste the API URL and publishable key db:start printed
npm run web               # or: npm run ios / npm run android
```

Local demo account: `demo@recallmate.test` / `recallmate-demo` (see `supabase/seed.sql`). It comes with three packs at different stages and six weeks of review history. Email confirmation is on locally, as in production, so new accounts need their confirmation link: local emails (confirmations and password resets) land in Mailpit at http://127.0.0.1:54324.

To test on a physical phone, replace `127.0.0.1` in `.env.local` with your computer's LAN IP.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run web` / `ios` / `android` | Start the dev server |
| `npm run typecheck` | TypeScript, no emit |
| `npm run lint` | ESLint (Expo config + React Compiler rules) |
| `npm test` | Jest unit tests |
| `npm run db:start` / `db:stop` | Start/stop local Supabase |
| `npm run db:reset` | Rebuild the local database from migrations + seed |
| `npm run db:test` | pgTAP database tests |
| `npm run db:types` | Regenerate `src/lib/database.types.ts` from the local schema |
| `npm run packs:build -- --out <file>` | Write a study-pack migration from `content/packs/` (see `content/README.md`) |
| `npm run build:web` | Production web export to `dist/` |

## Project structure

```
src/
  app/                 Expo Router screens
    (auth)/            welcome, sign-in, sign-up, forgot-password
    (app)/(tabs)/      Today, Library, Packs, Progress
    (app)/review.tsx   review session
    (app)/memory/      create / edit cards
    (app)/pack/[id]    pack detail
  components/          design-system components (Button, Card, ProgressRing, Confetti…)
  features/            auth, memories, packs, progress, review (data hooks + feature UI)
  lib/                 Supabase client, dates, scheduling, errors
  theme/               color, type, spacing and motion tokens
content/packs/         study packs: a folder per subject, a JSON file per pack
supabase/
  migrations/          schema, RLS policies, RPCs, and generated pack content
  tests/               pgTAP tests
  seed.sql             local demo data
scripts/               pack migration builder, icon renderer
```

## How scheduling works

All scheduling runs in Postgres (`public.review_memory`), so every device agrees. Each card has a `stage` (consecutive successful reviews) and a `due_on` date.

- Created → due tomorrow.
- Passed at stage *s* → stage *s + 1*, next review in `fib(s + 2)` days: 1, 2, 3, 5, 8, 13…
- Missed → stage 0, due tomorrow.
- A card counts as **mastered** at stage 5 (gaps of 8+ days).

The app sends its local date with each review; the server rejects dates that can't be anyone's "today" and reviews of cards that aren't due yet.

## Editing study packs

Each subject lives in `content/packs/<subject>/` (a `category.json` plus one file per pack of exactly 100 cards). [`content/README.md`](content/README.md) covers the format, the markup (`$…$` LaTeX math, `$\ce{…}$` chemistry, backtick code) and typed-answer rules. After editing:

```bash
npx jest content                                                        # validate every pack
npm run packs:build -- --out supabase/migrations/<timestamp>_update_packs.sql
npm run db:reset                                                         # apply locally
```

The generated SQL upserts by id and prunes removed cards, so publishing updates is safe. Students' copies of cards they never edited follow the new text; cards they edited are left alone.

## Deploying

1. **Supabase**: create a project, then `npx supabase link --project-ref <ref>` and `npx supabase db push` to apply the migrations. With the Supabase MCP connector, the same steps can be run from Claude. Under Authentication → URL Configuration, set the Site URL to your web app and add `https://<your-site>/**` to the redirect URLs; email links fall back to the Site URL when their redirect isn't allowed. Supabase's built-in email sender only delivers to your project's team members, a few emails an hour, so before inviting other people either set up custom SMTP (Authentication → Emails → SMTP settings) or turn off **Confirm email**.
   - **Email templates:** paste `supabase/templates/confirmation.html` into Authentication → Emails → *Confirm signup* and `supabase/templates/recovery.html` into *Reset password* (subjects are in `supabase/config.toml`). Their links open the app's `/confirm` page, where a tap spends the one-time token, so mail scanners that open every link (Outlook Safe Links, many campus gateways) can't use it up first. Deploy the app before switching templates.
2. **Web (Netlify)**: `netlify.toml` is included. Set `EXPO_PUBLIC_SUPABASE_URL`, `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY` and `EXPO_PUBLIC_SITE_URL` in the site's environment variables.
3. **iOS/Android (EAS)**: `npx eas-cli@latest build --profile production`, with the same `EXPO_PUBLIC_*` variables configured as EAS environment variables.

## Spaced repetition

Background reading: [Spaced Repetition (KPU Learning Centres)](https://www.kpu.ca/sites/default/files/Learning%20Centres/Think_SpacedRepetition_LA.pdf)
