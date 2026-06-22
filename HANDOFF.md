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

## Remaining MVP limitations

- Persistence and timestamps remain client-side and are not authoritative.
- Czech and Ukrainian catalogue text has complete coverage, but native-speaker editorial review remains recommended for final publication quality.
- Real-device iOS Safari and Android Chrome testing remains recommended.
- Content beyond Chapter 1 is intentionally not implemented.

Read this file first when continuing in a new Codex thread.
