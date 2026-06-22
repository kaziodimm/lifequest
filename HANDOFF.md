# Habidoo — current handoff

## Repository

- Repository: `kaziodimm/lifequest`
- Production branch: `main`
- Production URL: https://lifequest-gamma.vercel.app
- Product source of truth: Product Bible documents in the repository.

## Current product stage

The artistic direction is frozen. Do not generate new themes, backgrounds, icons, decorative effects, or future-era structures. Work is focused on guided missions, persisted evidence, Focus Objects, first-user flow, honest progression, and mobile stability.

## Guided mission system

- `MissionDefinition` is the shared contract for Tree and Command Center missions.
- `MissionAttempt`, answers, evidence, rewards, and selected Focus Object persist in Zustand/localStorage.
- Only one technology mission can be active. Legacy Daily Mission actions delegate to the same technology mission flow.
- Completion requires minimum elapsed time and all required answers; rewards are issued once.
- Root missions for all seven branches use prepared choices or structured fields instead of empty prompts.
- Later missions reuse the branch Focus Object automatically.
- The planner can link to a mission but no longer grants XP for arbitrary checkbox completion.

## First-user flow

- New users choose language, one branch, and one prepared Focus Object.
- Onboarding sends them directly to the relevant root node with its mission panel open.
- Existing persisted users are redirected from `/` to `/tree`.
- Onboarding navigation is hidden so the first mission remains the only primary path.

## Localization

- Supported locales: English, Russian, Czech, Ukrainian.
- New onboarding, mission, Command Center, and shared UI text exists in all four locales.
- Russian chapter-one technology content is localized by ID in `lib/technology-i18n.ts`.

## Verification completed

- Mission rule tests: 12/12 passing.
- TypeScript typecheck: passing.
- Next.js production build: passing.
- Browser flow checked at 390×844 and 1440×900: onboarding, Russian locale, branch/focus selection, focused mission panel, no horizontal page overflow.
- Mobile mission panel is opaque and its entry animation is disabled to avoid the temporary translucent/flickering state.

## Remaining MVP limitations

- Persistence and timestamps remain client-side and are not authoritative.
- Czech and Ukrainian cover the new guided flow, but the older full chapter technology catalogue is not yet fully translated.
- Real-device iOS Safari and Android Chrome testing remains recommended.
- Content beyond Chapter 1 is intentionally not implemented.

Read this file first when continuing in a new Codex thread.
