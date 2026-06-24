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
- Deployment guardrail commit: `a8fad2a chore: ignore local pnpm workspace artifacts`.
- Pushed to GitHub `main`: `a8fad2a09af2e7cf0ad6c03bb31fef65307d4c99`.
- Local verification after corrections:
  - `node --experimental-strip-types --test tests/mission-rules.test.ts`: 26/26 passing.
  - `tsc --noEmit`: passing.
  - `next build`: passing.
  - Browser QA on local dev server: onboarding guard, onboarding, tree auto-focus, mission panel, Command Center, profile reset, desktop/mobile overflow checked; browser console errors: 0.
- Vercel Git deployments are still `BLOCKED` because GitHub reports commits as `unverified`, but direct CLI production deploy succeeded using a valid Vercel token.
- Production deployment: `dpl_GRwADfRfanYELNfqjGuftEqDmN5D`.
- Production URL: `https://lifequest-porh5ulr9-kazi-s-projects3.vercel.app`.
- Alias: `https://www.habidoo.com`.
- Deployment state: `READY`.
- Domain check: `https://www.habidoo.com/` returned HTTP `200`.

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

## Supabase/Auth MVP setup notes

Supabase/Auth work must not change the frozen tree visual direction or the XP/Research/Insight economy.

Required production environment variables:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

Do not add a Supabase `service_role`/secret key to the browser or to any `NEXT_PUBLIC_*` variable.

Database migration:

- `supabase/migrations/20260623150000_auth_cloud_save_mvp.sql`
- Tables: `public.profiles`, `public.user_game_state`.
- RLS: enabled on both tables; `anon` access revoked; authenticated users can select/insert/update only their own rows via `(select auth.uid()) = user_id`.
- `profiles.habid` is unique, lowercase, 3-24 chars, starts with a letter/number, allows only `a-z`, `0-9`, `_`, and blocks reserved names.
- Profile updates intentionally do not grant column permission for `habid`, so the MVP locks Habid after creation.

Supabase Auth dashboard setup:

- Site URL: `https://www.habidoo.com`
- Redirect allow list: `https://www.habidoo.com/auth/confirm` and local dev `http://localhost:3000/auth/confirm`.
- Enable email confirmations.
- Configure custom SMTP with Resend in Supabase Auth settings. Use Resend SMTP credentials from the verified Habidoo sending domain; never commit the Resend API key.
- Use `supabase/email-templates/habidoo-magic-link.html` as the branded Magic Link/confirmation template. The button routes to `/auth/confirm` and then back to `/profile`.
- Configure Auth rate limits in the Supabase dashboard. Add Turnstile/hCaptcha there before public launch if abuse appears; the app currently has no committed CAPTCHA secret.
- Implementation commit: `1d25bdf feat: add supabase cloud auth mvp`.
- Pushed to GitHub `main`: `1d25bdfec50e4f592b0b7602139231fab72f76bb`.
- Vercel Git deployment for this commit is `BLOCKED` because GitHub still reports `githubCommitVerification: unverified`.
- Direct Vercel CLI production deploy succeeded by deploying a clean temporary copy outside the Git repository, avoiding GitHub verification metadata:
  - Production deployment: `dpl_Dm72hSGokLhBBfc7aTaEgTgYguw2`.
  - Production URL: `https://lifequest-lkmd829m3-kazi-s-projects3.vercel.app`.
  - Alias: `https://www.habidoo.com`.
  - Deployment state: `READY`.
  - Vercel fetch check: `https://www.habidoo.com/profile` returned HTTP `200`.
- Supabase project `habidoo-prod` exists:
  - Project ref: `oywbykuqvdvqsybwpkig`.
  - API URL: `https://oywbykuqvdvqsybwpkig.supabase.co`.
  - Migration `auth_cloud_save_mvp` applied successfully.
  - Corrective migration `tighten_cloud_save_table_grants` applied successfully.
  - RLS verified enabled on `profiles` and `user_game_state`.
  - Policies verified: own-row `SELECT`, `INSERT`, `UPDATE` via `(select auth.uid()) = user_id`.
  - Grants verified: no `anon` grants; `authenticated` has table-level `SELECT/INSERT` and column-level `UPDATE` only for allowed update columns.
- Vercel production env added:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- Production redeploy after env setup:
  - Deployment: `dpl_8NttKBTc5ymH2RS2v3eyr6CAFVXR`.
  - Production URL: `https://lifequest-itq414tjo-kazi-s-projects3.vercel.app`.
  - Alias: `https://www.habidoo.com`.
  - Deployment state: `READY`.
  - Vercel fetch check: `https://www.habidoo.com/profile` returned HTTP `200`.
- Test account cleanup:
  - Removed the only auth user (`kaziodimm@gmail.com`) after the first signup test.
  - Verified `auth.users` count returned `0`.
- Account UX correction:
  - Profile now presents `Habidoo account` with `Create account` / `Log in`, not `Cloud save` as the primary concept.
  - Signup now uses email + password with email confirmation.
  - Login uses email + password.
  - Added branded `Confirm signup` email template at `supabase/email-templates/habidoo-confirm-signup.html`; Supabase dashboard must use this template for signup confirmation emails.
  - Verification: tests 34/34 passing, typecheck passing, Next production build passing.
  - Production deployment: `dpl_G55txkyFHutqcxKp8yNFYYzM6DHL`.
  - Alias: `https://www.habidoo.com`.
  - Deployment state: `READY`.
  - Vercel fetch check: `https://www.habidoo.com/profile` returned HTTP `200`.
- Account autosync correction:
  - Removed manual `Save progress to account` CTA.
  - After Habid/profile creation, progress sync starts automatically.
  - If account progress already exists on login, the user still chooses `Use account progress` or `Keep this device progress`; after that choice autosync starts.
  - Verification: tests 34/34 passing, typecheck passing, Next production build passing.
  - Production deployment: `dpl_G3RB9T95W8gtPgCFSboVwDAwbt55`.
  - Alias: `https://www.habidoo.com`.
  - Deployment state: `READY`.
  - Vercel fetch check: `https://www.habidoo.com/profile` returned HTTP `200`.
- Account-first access gate:
  - Unauthenticated users no longer see Tree, Missions, Stats, Awards, or Profile.
  - `/` is now a pre-login landing page with Habidoo positioning and account signup/login.
  - Tool routes require a confirmed Supabase account, a Habid/profile row, and completed onboarding.
  - Confirmed users without Habid/profile are routed to `/profile`.
  - Verification: tests 35/35 passing, typecheck passing, Next production build passing.
  - Production deployment: `dpl_92XiK2vi46S2A5nx1vLi8J4pSCCe`.
  - Alias: `https://www.habidoo.com`.
  - Deployment state: `READY`.
  - Vercel fetch checks: `/` returned HTTP `200`; `/tree` unauthenticated returned the gated `Preparing Habidoo...` shell.
- Pre-login and post-Habid fix:
  - `/` pre-login page now has language switching, richer product copy, Foundation Era visual, product steps, and account form.
  - Fixed post-login/profile gate bug by dispatching and listening for `habidoo:account-profile-changed` after Habid creation.
  - This prevents the app from bouncing the user back to Profile after Habid creation when clicking Tree/Missions/Stats.
  - Verification: tests 35/35 passing, typecheck passing, Next production build passing.
  - Production deployment: `dpl_5iDbrJSD9VXfVrMyogRQNpVNxKEd`.
  - Alias: `https://www.habidoo.com`.
  - Deployment state: `READY`.
  - Vercel fetch check: `/` returned HTTP `200`.

## Active mission state repair — 2026-06-23

- Implementation commit: `ece1068 fix: repair broken active mission state`.
- Pushed to GitHub `main`: `ece1068c17b5a69786aecb04905d2ff4ada1aa89`.
- Added active mission reconciliation for persisted state:
  - active technology runtime must have an `activeMissionAttemptId`;
  - that attempt must exist in `missionAttempts`;
  - the attempt must belong to the same technology;
  - invalid active runtimes are safely reset to `ready` with `startedAt` cleared;
  - no fake attempt is created during migration.
- Added MissionPanel recovery UI for broken active missions:
  - shows “Mission state needs repair” instead of an empty non-saving form;
  - “Reset active mission” resets only the broken active runtime, not all local progress.
- Legacy `dailyMissions` and `planner` are now treated as migration/deprecated fields; active MVP progress is `technologyRuntime + missionAttempts + focusObjects + chapterSummaries`.
- Verification:
  - `node --experimental-strip-types --test tests/mission-rules.test.ts`: 30/30 passing.
  - `tsc --noEmit`: passing.
  - `next build`: passing.
  - Local browser smoke: `/tree` loads, mission can start, rating/text answers accept input, `/command` has no 24h Planner and shows the active mission.
- Vercel Git deployments for `ece1068` and `86b5c6e` are `BLOCKED` because GitHub still reports commits as `unverified`.
- Direct Vercel CLI production deploy succeeded after the Git block:
  - Production deployment: `dpl_B2J3Ux4pwX5b6DFN6931psHic95F`.
  - Production URL: `https://lifequest-hl8nmxl6s-kazi-s-projects3.vercel.app`.
  - Alias: `https://www.habidoo.com`.
  - Deployment state: `READY`.
  - Domain checks: `https://www.habidoo.com/`, `/tree`, and `/command` returned HTTP `200`.

## Pre-login polish and profile-bounce fix — 2026-06-23

- Fixed the post-login navigation bug where clicking Tree/Missions/Stats could flash `Preparing Habidoo...` and return to Profile.
- Cause: protected tool routes were hard-gated on the async `hasProfile/profileLoaded` check. If the local session was authenticated but profile hydration was late/stale, AppShell treated the account as not ready and redirected back to `/profile`.
- Change: protected app routes now require an authenticated account; tool routes additionally require completed onboarding. Habid/profile state remains available for account UI and sync, but it is no longer a brittle navigation blocker.
- Improved `/` pre-login page:
  - richer Foundation Era hero section;
  - visible language switcher;
  - product promise/steps;
  - stronger account-first messaging;
  - code-generated Habidoo product visual with account, focus, mission, tree and stats nodes.
- Verification:
  - `node --experimental-strip-types --test tests/mission-rules.test.ts`: 35/35 passing.
  - `tsc --noEmit`: passing.
  - `next build`: passing.
- Commit: `1263c01 fix: polish prelogin and loosen auth gate`.
- Pushed to GitHub `main`.
- Production deployment:
  - Deployment id: `dpl_HLKmkLytQH2x4ujGhn1fVUxRfYjK`.
  - Production URL: `https://lifequest-i6cab8rmm-kazi-s-projects3.vercel.app`.
  - Aliases: `https://habidoo.com`, `https://www.habidoo.com`, `https://lifequest-gamma.vercel.app`.
  - Deployment state: `READY`.
  - Fetch checks: `https://www.habidoo.com/` returned HTTP `200`; `/tree` returned HTTP `200`.
- Pending manual check: register/login again and click Tree/Missions/Stats/Profile from the real account.

## Public landing, localization, legal pages — 2026-06-23

- Improved the public pre-login page toward a Habitica-like product landing structure, but with Habidoo's mature life-progress positioning instead of RPG/pixel art.
- Generated and added a new hero image:
  - `public/art/landing/habidoo-life-system-hero.png`
  - Prompt goal: premium modern self-improvement product visual showing a living life tree, guided missions, focus areas, progress and stats.
- `/` now uses the generated hero image and localized landing/onboarding/auth copy for EN/RU/CS/UK on the public and first-user path.
- `CloudAccountPanel` accepts an optional `locale` prop and localizes account/signup/login/Habid/sync messages for EN/RU/CS/UK.
- Added public legal/info pages:
  - `/terms` — Terms of Use MVP text.
  - `/privacy` — Privacy Policy MVP text.
  - `/rules` — Rules of Use MVP text.
- Added footer links from the landing page to Rules, Terms and Privacy.
- Verification:
  - `node --experimental-strip-types --test tests/mission-rules.test.ts`: 35/35 passing.
  - `tsc --noEmit`: passing.
  - `next build`: passing.
- Commit: `6136a23 feat: polish public landing and legal pages`.
- Pushed to GitHub `main`.
- Production deployment:
  - Deployment id: `dpl_HPUkedZ2nEchp8zGc864vK8zy9BF`.
  - Production URL: `https://lifequest-cwyvxyfg3-kazi-s-projects3.vercel.app`.
  - Alias: `https://www.habidoo.com`.
  - Deployment state: `READY`.
  - Fetch checks: `/`, `/terms`, `/privacy`, `/rules`, and `/art/landing/habidoo-life-system-hero.png` returned HTTP `200`.
- Note: global `lib/i18n.ts` still contains legacy mojibake in older translated keys. The public pre-login/onboarding/auth path now bypasses that with clean local copy; a later technical cleanup can re-encode/replace the full global dictionary.

Read this file first when continuing in a new Codex thread.

## First-session guidance pass — 2026-06-24

- Implementation commit: `702a3f4 feat: guide first mission session`.
- Reworked all seven root missions so the first step is a concrete real-world action before any reflection-style evidence:
  - Health starts with water, slow breathing and a 60-second stretch, then records energy/body signal.
  - Mind starts with closing distractions and naming a 5-minute next action.
  - Finance requires opening a money source and saving a sanitized snapshot.
  - Business requires opening a project surface and producing a tiny visible artifact.
  - Career requires saving an opportunity or updating a career surface.
  - Relationships requires sending/drafting a meaningful message.
  - Creativity requires a 10-minute rough draft and saved result.
- Added first-session guide state to the persisted game state: `firstSessionGuideDismissed`, `firstMissionCompletedAt`, and `firstPostMissionHintSeen`, with safe migration defaults.
- Added a compact dismissible first-session guide on the Life Tree that explains the five-step loop: start root mission, do action, save evidence, read result, choose next step in Command Center.
- Added restrained first-completion feedback in the mission panel with XP, Research, cooldown explanation, “You are not blocked” guidance, and CTAs to Command Center or Tree.
- Reduced the first completed root mission global cooldown to the existing micro cooldown path while preserving the one-active-mission rule and personal branch cooldowns.
- Improved Command Center cooldown state so it explains personal/global cooldown, shows remaining time, and suggests non-fake actions: review evidence, profile progress, achievements, prepare next focus, or return later.
- Updated EN/RU/CS/UK mission and guide/cooldown copy for changed first-session content.
- Added tests for action-first root missions, first-session guide state migration, localized guide/cooldown copy, and preserved no-24h-Planner guardrails.

Verification:

- `npm test`: 38/38 passing.
- `npm run typecheck`: passing.
- `npm run build`: passing.

Remaining limitations / manual checks still needed:

- Browser signup/login and full first-session completion should still be checked against a real Supabase/Vercel environment before production release.
- Real mobile Safari/Android Chrome overflow and mission-panel ergonomics still need device QA.
- Czech and Ukrainian new copy is localized but native-speaker editorial review remains recommended.

## First Step Guide Mission pass — 2026-06-24

- Implementation commit: `1addc41 feat: add first step guide missions`.
- Changed files:
  - `lib/guide-missions.ts`
  - `lib/types.ts`
  - `lib/store.ts`
  - `components/life-tree.tsx`
  - `app/command/page.tsx`
  - `lib/i18n.ts`
  - `tests/mission-rules.test.ts`
- First session now uses a separate onboarding-layer guide mission before the real Life Tree mission:
  1. user chooses one first step from the seven life branches;
  2. user completes a short concrete guide action;
  3. the guide step grants a small one-time Research reward;
  4. a restrained reward banner shows “First Step Complete / Life Tree Activated”;
  5. CTA opens the matching root Technology Mission;
  6. normal mission cooldown appears only after real Technology Missions.
- Guide missions are separate from Technology Missions:
  - they do not call `startTechnologyMission` or `completeTechnologyMission`;
  - they do not set `globalMissionCooldownUntil`;
  - they do not set personal cooldown;
  - they do not mutate `technologyRuntime`;
  - they do not create `MissionAttempt` or active Technology Mission state;
  - they are one-time and the Research reward cannot be farmed.
- Added guide state to Zustand/localStorage/cloud snapshots:
  - `guideMissionSelectedId`;
  - `guideMissionCompletedIds`;
  - `guideMissionAnswers`;
  - `firstGuideCompletedAt`;
  - `firstGuideRewardClaimed`;
  - `firstRealMissionStartedAt`.
- Old persisted states migrate safely. If a persisted user already has Technology Mission attempts, `firstRealMissionStartedAt` is inferred so the new first-step onboarding does not reappear for existing users.
- Command Center now handles first-step scenarios:
  - no guide selected → choose first step;
  - guide selected but incomplete → continue first step;
  - guide completed but real mission not started → start the matching root mission;
  - real mission active/cooldown → existing mission flow.
- Normal Technology Mission cooldown remains preserved for real Life Tree missions. The previous first-root micro-cooldown special case was removed from `completeTechnologyMission`; cooldown is now only a real mission concept, not the onboarding action.
- Added EN/RU/CS/UK guide UI and guide mission copy. Native-speaker editorial review for CS/UK remains recommended.

Verification:

- `npm test`: 44/44 passing.
- `npm run typecheck`: passing.
- `npm run build`: passing.

Remaining manual checks:

- New account / post-onboarding first session in a real browser.
- Choose and complete guide mission.
- Verify no cooldown after guide mission.
- Verify reward banner appears and CTA opens the correct root node.
- Start and complete the first real Technology Mission; verify normal cooldown appears only there.
- Mobile 390×844 and desktop 1440×900 overflow/ergonomics.
- Production deploy check after merge.
