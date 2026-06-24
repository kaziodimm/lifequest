# Habidoo — current handoff

Last updated: 2026-06-24

## Start here

Every new Codex thread must read these files first:

1. `HANDOFF.md`
2. `docs/product/HABIDOO_Product_Logic_v3_RU.md`
3. `docs/product/HABIDOO_Progression_Rewards_Level_100_RU.md`

`docs/product/HABIDOO_Product_Logic_v3_RU.md` is the current product source of truth.

If older Product Bible / progression documents conflict with v3, follow v3.

## Repository and production

- Repository: `kaziodimm/lifequest`
- Production branch: `main`
- Canonical production URL: `https://www.habidoo.com`
- Supabase project: `habidoo-prod`
- Supabase project ref: `oywbykuqvdvqsybwpkig`
- Supabase API URL: `https://oywbykuqvdvqsybwpkig.supabase.co`

## Current product stage

Habidoo is not ready for beta yet. The current focus is product hardening, not adding new eras or visual theme generations.

The artistic direction is frozen. Do not generate new tree themes, future-era visuals, large decorative effects, new backgrounds, or new icon sets unless explicitly requested.

Current goal: bring the product from demo/MVP feeling toward beta-quality product foundation.

## Superseded logic / do not continue

Do not continue implementing these older patterns:

1. `Technology Node = repeat one mission N times`.
2. Root/start missions as repeat-count tasks.
3. First completed mission leading mainly into cooldown explanation.
4. Profile as a mixed page for language, reset, theme selection, account, inventory and status.
5. Theme picker taking large space in Profile.
6. Cloud sync that only runs when `CloudAccountPanel` is mounted on Profile.
7. Reward slots/future rewards shown on every normal mission.
8. 24h Planner as a central product mechanic.
9. Habitica-style todo-list mechanics.
10. New-user tasks based on vague reflection before the user understands the product.

## Current product logic v3

Correct mission architecture:

```text
Technology Node = Lesson Chain + Gold/Mastery Step
```

A node should not ask the user to repeat the same action 5 times. It should progress through related but different steps:

```text
Step 1 — First action
Step 2 — Similar but different action
Step 3 — Real-world application
Step 4 — Proof / evidence
Step 5 — Gold / Mastery challenge
```

Repeated actions are acceptable only where repetition has real-life meaning: walking, training, reading, focus sessions, routines, weekly reviews.

Root/start nodes should feel like progression, not repetition.

## Priority backlog before beta

P0 — must happen first:

1. Global cloud sync across devices.
   - Progress completed on desktop must appear on phone and the other way around.
   - Sync must not depend on opening Profile.
   - Implement a global `CloudSyncProvider` or equivalent.
   - Prevent empty local state from overwriting newer server state.
   - Add conflict-safe restore/upload logic.

P1 — first-user product flow:

2. Strong guide system for new users.
   - Visible and primary, not a small side hint.
   - User can skip/refuse, but the guide must be clearly presented first.
   - Guide step has no cooldown.
   - Guide leads to first real lesson-chain mission.
   - Reward/animation after guide completion must make user feel progress started.

3. Convert root/start missions to lesson chains.
   - Replace repeat-count mission progress with different lesson steps.
   - Add visible node progress and Gold/Mastery state.

P2 — visible product maturity:

4. Completion banners, visible progress, restrained animations.
5. Recalculate XP, Research, Insight, achievements and rewards around lesson-chain logic.
6. Redesign Missions/Command, Stats and Awards pages using clearer game/product references.
7. Improve layout quality on mobile and desktop: no clipping, no hidden important controls, no text overflow.
8. Separate Profile, Inventory and Settings.
9. Add in-app notifications and reminders.
10. Improve pre-login landing page so it explains and sells the product.
11. Polish legal/rules/privacy/account maturity.

## Page architecture target

```text
Profile = player identity/status.
Inventory = owned cosmetics and equipped items.
Settings = language, password, email, notifications, privacy, reset, delete/export data.
Tree = tree progress + quick theme slots.
Command/Missions = active mission, next step, cooldown/ready states, weekly focus.
Stats = readable progress history and branch development.
Awards = meaningful achievements and unlocked/secret rewards.
Notifications = reminders and action events.
```

Do not put everything in Profile.

## Inventory direction

Use a Destiny/Fortnite hybrid:

- profile identity card;
- equipped slots;
- item tabs;
- preview;
- equip/unequip;
- owned/locked/coming soon.

Categories:

- Badges;
- Titles;
- Frames;
- Profile Effects;
- Tree Themes;
- Legacy / Prestige.

Tree themes remain accessible in the Tree, but if many themes exist, use 3-5 quick theme slots plus `Theme Library`, not a long row of buttons.

## Notifications direction

Start with in-app notifications before browser push/email.

Events:

- mission timer finished;
- cooldown finished;
- guide step waiting;
- reward unclaimed;
- weekly review available;
- trial ready;
- sync issue;
- account/security events.

Requirements:

- notification center;
- unread counter;
- action button;
- notification settings later;
- no spam.

## Current technical state to verify before coding

Known implemented systems:

- Supabase Auth with confirmed email and Habid profile.
- `profiles` and `user_game_state` tables with RLS.
- Account-first access gate.
- `MissionDefinition`, `MissionAttempt`, evidence, focus objects and `technologyRuntime` in Zustand/localStorage.
- Active mission repair for invalid persisted active state.
- 24h Planner removed from active UI.
- Public landing, Terms, Privacy and Rules pages exist.
- First-session guide exists, but it is superseded by v3 guide requirements.

Known weak area:

- Cloud sync currently likely lives inside `CloudAccountPanel`, so autosync may only run when Profile is mounted. This is not acceptable for beta.

## Supabase/Auth notes

Required production env vars:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

Never expose `service_role` or secret keys in browser or `NEXT_PUBLIC_*` variables.

Database:

- `public.profiles`
- `public.user_game_state`
- RLS enabled on both.
- `anon` access revoked.
- authenticated users can select/insert/update only their own rows via `(select auth.uid()) = user_id`.
- `profiles.habid` is unique, lowercase, 3-24 chars, starts with letter/number, allows only `a-z`, `0-9`, `_`, and blocks reserved names.
- MVP locks Habid after creation.

Auth dashboard:

- Site URL: `https://www.habidoo.com`
- Redirect allow list: `https://www.habidoo.com/auth/confirm` and local dev `http://localhost:3000/auth/confirm`
- Email confirmations enabled.
- Resend SMTP configured through Supabase dashboard, not committed.

## Implementation rules for Codex

Before any coding pass:

1. Read this file.
2. Read `docs/product/HABIDOO_Product_Logic_v3_RU.md`.
3. Inspect the actual code files relevant to the task.
4. Do not assume old product docs are current if v3 says otherwise.

During implementation:

- Keep changes scoped.
- Do not add new eras.
- Do not add new generated art/themes unless explicitly requested.
- Do not reintroduce 24h Planner.
- Do not build a Habitica clone.
- Do not make Profile the dumping ground for settings/inventory/theme selection.
- Do not let guide/lesson changes break cloud state migration.
- Every pass must update `HANDOFF.md` with what changed and what was verified.

Verification expected for code passes:

```bash
npm test
tsc --noEmit
next build
```

If scripts differ in `package.json`, use the repository scripts.

Manual QA expected before beta:

- desktop account signup/login;
- mobile account login;
- desktop -> complete mission -> phone sees progress;
- phone -> complete mission -> desktop sees progress;
- first-user guide on mobile 390x844;
- desktop 1440x900 layout;
- no important buttons clipped;
- no horizontal overflow;
- legal pages reachable;
- user can understand next action without founder explanation.

## Last documentation changes

- Added `docs/product/HABIDOO_Product_Logic_v3_RU.md`.
- Replaced old progression spec with a compatibility note pointing to v3.
- Reset this `HANDOFF.md` around current v3 logic to avoid old repeat-count/cooldown guidance confusing future Codex chats.
