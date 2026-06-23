# Habidoo — current handoff

## Repository

- Repository: `kaziodimm/lifequest`
- Production branch: `main`
- Canonical production URL: https://www.habidoo.com
- `habidoo.com` and production Vercel aliases redirect to the canonical `www` origin so browser-local progress is not split across entry domains.
- Product source of truth: Product Bible documents in the repository.

## Current product stage

The artistic direction is frozen. Do not generate new themes, backgrounds, icons, decorative effects, or future-era structures. Work is focused on guided missions, persisted evidence, Focus Objects, first-user flow, honest progression, and mobile stability.

## Guided mission system

- `MissionDefinition` is the shared contract for Tree and Command Center missions.
- `MissionAttempt`, answers, evidence, rewards, and selected Focus Object persist in Zustand/localStorage.
- Only one technology mission can be active. Legacy Daily Mission actions delegate to the same technology mission flow.
- Completion requires minimum elapsed time and all required answers; rewards are issued once.
- Root missions and the first mission after each root in all seven branches use prepared choices or structured fields instead of empty prompts.
- Later missions reuse the branch Focus Object automatically.
- The planner can link to a mission but no longer grants XP for arbitrary checkbox completion.

## First-user flow

- New users choose language, one branch, and one prepared Focus Object.
- Onboarding sends them directly to the relevant root node with its mission panel open.
- Existing persisted users are redirected from `/` to `/tree`.
- Onboarding navigation is hidden so the first mission remains the only primary path.

## Localization

- Supported locales: English, Russian, Czech, Ukrainian.
- Onboarding, missions, Command Center, profile, accessibility controls, and shared UI text exist in all four locales.
- Russian, Czech, and Ukrainian Chapter 1 content is localized by ID. The audit covers all 65 technology titles, descriptions, actions, outcomes, and mission steps.
- Czech and Ukrainian include static fallback translations for every one of the 207 shared UI source keys; curated product terminology overrides the generated baseline.

## Verification completed

- Mission rule, localization-coverage, and content-contract tests: 17/17 passing.
- TypeScript typecheck: passing.
- Next.js production build: passing.
- Browser flow checked at 390×844 and 1440×900: onboarding, Russian, Czech, and Ukrainian locales, branch/focus selection, focused mission panel, no horizontal page overflow.
- Mobile mission panel is opaque and its entry animation is disabled to avoid the temporary translucent/flickering state.

## Correction stage status — 2026-06-23

- Corrective implementation commit: `581415a fix: tighten guided mission correction stage`.
- Pushed to GitHub `main`: `581415a12ec79fc453b703b46f3d65227d0931cf`.
- Local verification after corrections:
  - `node --experimental-strip-types --test tests/mission-rules.test.ts`: 26/26 passing.
  - `tsc --noEmit`: passing.
  - `next build`: passing.
  - Browser QA on local dev server: onboarding guard, onboarding, tree auto-focus, mission panel, Command Center, profile reset, desktop/mobile overflow checked; browser console errors: 0.
- Vercel Git deployment for `581415a` exists but is `BLOCKED`: `dpl_37y6G7zK7rKURXCe1hp8Ujdnm3JJ`.
- Direct CLI deploy was attempted via `pnpm dlx vercel@latest --prod --yes`, but the local/CLI auth token is invalid: `The specified token is not valid`.
- Production `www.habidoo.com` may still point to the previous READY direct deployment until Vercel auth/Git verification is fixed or a valid Vercel CLI token is supplied.

Implemented in the corrective stage:

- Removed the 24h Planner UI from Command Center and replaced it with active mission, recommended mission, alternatives, weekly state and nearest milestone.
- Recommendation now scores primary category, focus object, progress/milestone context and cooldown instead of taking the first array items.
- Normal mission reward display now shows XP and Research only; placeholder/future reward slots are gone from the mission panel.
- `Taskovo` was removed from product source examples/placeholders/translations.
- Focus Object reuse now selects the latest object per category; root missions update/replace the category object.
- Evidence now stores normalized summaries from user answers and sanitized full answers; sensitive finance fields are excluded from evidence answers.
- Awakening Trial now has real completion gates: at least four completed branches, three real completed practices, a personal rule, a weekly standard and saved focus data.
- Mission input validation covers single/multi choice, checklist, rating, confirmation, number, text, link and date/time cases.
- Profile now has controlled local reset with warning and two-step confirmation.
- Protected pages now have a client-side onboarding guard after hydration.
- Old dead achievements/streak UI was removed from profile/awards surfaces; stats now derive weekly chart data from MissionAttempts.
- Added integration tests for the correction points.

## Remaining MVP limitations

- Persistence and timestamps remain client-side and are not authoritative.
- Czech and Ukrainian catalogue text has complete coverage, but native-speaker editorial review remains recommended for final publication quality.
- Real-device iOS Safari and Android Chrome testing remains recommended.
- Content beyond Chapter 1 is intentionally not implemented.

Read this file first when continuing in a new Codex thread.
