This is an Expo/React Native mobile application. Prioritize mobile-first patterns, performance, and cross-platform compatibility.

## Expo has changed — do not trust your training data

Expo ships breaking changes every SDK release. APIs you remember are likely renamed, moved, or removed. Before writing any code that touches an Expo, EAS, or React Native API:

1. Read the major version of the `expo` package in `package.json`.
2. Fetch the matching versioned docs: `https://docs.expo.dev/versions/v<major>.0.0/`
3. For anything else, fetch https://docs.expo.dev/llms.txt — an index of all Expo docs with corrections to common LLM misconceptions. Follow its links to the specific page you need; never answer from memory.

## Commands

Use `bunx` instead of `npx` if the project uses bun (`bun.lock` present).

```bash
npx expo install <package>  # ALWAYS use instead of npm/yarn/pnpm/bun add — resolves SDK-compatible versions
npx expo start              # start the dev server
npm run lint                # lint (ESLint; `expo lint` misreads the ESLint 9 version)
npx tsc --noEmit            # typecheck
npx expo-doctor             # diagnose dependency and config issues
npx expo install --fix      # fix incompatible package versions
```

Run lint, typecheck and tests (`npm test`, `npm run db:test`) before declaring any task done.

## Navigation & Routing

- Use **Expo Router** for all navigation. Routes live in `src/app/` — every file there is a screen, `_layout.tsx` files define navigators. Keep non-route code (components, hooks, utils) outside `src/app/`.
- Import `Link`, `router`, and `useLocalSearchParams` from `expo-router`.
- Docs: https://docs.expo.dev/router/introduction.md

## Building with EAS

Use EAS to build, sign, and submit the app in the cloud (`eas build`, `eas submit`) and to ship over-the-air updates (`eas update`) — no local Xcode or Android Studio required. Run EAS CLI as `bunx eas-cli <command>` in Bun projects, or `npx eas-cli@latest <command>` otherwise; substitute that for bare `eas` in docs examples.
Docs: https://docs.expo.dev/eas/index.md

## Rules

- If `ios/` and `android/` directories do not exist, they are generated (Continuous Native Generation). Never create or edit them by hand — configure native behavior in `app.json` and config plugins.
- Expo Go only includes its bundled native modules. After adding a library with native code, the app needs a development build: `npx expo run:ios|android` locally, or `eas build --profile development`.
- Prefer recommended Expo modules over third-party libraries, and check your available skills before adding dependencies. Docs: https://docs.expo.dev/versions/latest/index.md

## RecallMate specifics

- Backend is Supabase. Schema, Row Level Security and RPCs live in `supabase/migrations/`. Scheduling logic is in SQL (`public.next_schedule`, used by `review_memory` and `review_profession_card`) and mirrored for display in `src/lib/schedule.ts`; keep them in sync.
- After changing the schema, run `npm run db:reset` and `npm run db:types`, and add pgTAP coverage in `supabase/tests/`.
- Study pack content lives in `content/packs/<subject>/` (one JSON file per pack); `content/README.md` is the authoring guide. Validate with `npx jest content`, then publish with `npm run packs:build -- --out supabase/migrations/<timestamp>_<name>.sql`. Never hand-edit generated pack migrations, and never rename or reuse a card id that is live.
- Profession content lives in `content/professions/<profession>/` (`profession.json`, `curriculum.json`, one card file per module); `content/professions/README.md` is the writing guide. Validate with `npx jest curriculum` (`MODULE=<slug>` for one module), check progress with `npm run professions:stats -- <profession>`, and publish with `npm run professions:build -- --profession <slug> --tiers <n> --out supabase/migrations/<timestamp>_<name>.sql`. Profession cards are stored once; learners only get progress rows, and every write goes through the security-definer functions in the professions migration. Never delete a shipped profession card: set `"retired": true`.
- Card text uses the markup in `src/lib/rich.ts` (KaTeX math, mhchem, code, highlights, callouts), rendered by `src/components/rich/RichText.tsx`.
- Typed answers are matched by `src/features/review/answerMatch.ts`: formatting-insensitive, meaning-sensitive. One-letter slips are "close" (free retry), never auto-accepted.
- Design tokens (colors, type, spacing, motion) are in `src/theme`. Use `Text`, `Button`, `Card` and friends from `src/components` rather than raw styles.
