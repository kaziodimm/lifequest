# Habidoo

Habidoo is a mobile-first Life Strategy RPG web app that turns real life into visible long-term progress.

This is not a habit tracker, not a task manager, and not a todo list. The core product is a **Life Technology Tree** where users progress through real-life domains by completing guided real-world actions, evidence-based lesson chains, milestones, trials, rewards and profile progression.

## Current Status

Habidoo is not ready for public beta yet. The current stage is product hardening before closed beta.

Current priority:

1. Reliable global cloud sync across devices.
2. Strong first-user guide flow.
3. Convert root/start missions from repeat-count tasks to lesson chains.
4. Visible progress, reward banners and beta-quality UI.
5. Profile / Inventory / Settings separation.

## Source of Truth

New Codex sessions must read these files first:

1. [HANDOFF.md](./HANDOFF.md)
2. [Product Logic v3 RU](./docs/product/HABIDOO_Product_Logic_v3_RU.md)
3. [Progression Compatibility Note RU](./docs/product/HABIDOO_Progression_Rewards_Level_100_RU.md)
4. [Codex Local Setup RU](./docs/dev/CODEX_LOCAL_SETUP_RU.md)
5. [First Local Codex Task: Global Sync RU](./docs/dev/CODEX_FIRST_TASK_GLOBAL_SYNC_RU.md)

If older docs conflict with Product Logic v3, follow v3.

## Product Direction

Correct current mission architecture:

```text
Technology Node = Lesson Chain + Gold/Mastery Step
```

Do not continue the old repeat-count model where a root/start mission asks the user to repeat the same action N times.

The Life Tree is still the center of the product. Everything else supports the Life Tree.

## Main Screens Target

- Public landing / pre-login
- First-user guide
- Life Tree
- Command / Missions
- Stats
- Awards / Achievements
- Profile
- Inventory
- Settings
- Notifications
- Legal pages

## Life Categories

- Body & Energy
- Focus & Mind
- Money & Freedom
- Build & Create
- Direction & Career
- People & Connection
- Creative Practice

## Stack

- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Zustand
- Supabase Auth / cloud save
- Vercel
- Recharts
- lucide-react

## Local Development

Use Node.js 20 or 22.

```bash
corepack enable
pnpm install --frozen-lockfile
cp .env.example .env.local
pnpm dev
```

Required local env:

```text
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
```

Do not commit `.env.local` or secret keys.

## Verification

Run before commits:

```bash
pnpm test
pnpm typecheck
pnpm build
```

## Product Docs

Some older docs remain for historical context, but current implementation decisions should follow `HANDOFF.md` and Product Logic v3.

Current docs:

- [HANDOFF](./HANDOFF.md)
- [Product Logic v3 RU](./docs/product/HABIDOO_Product_Logic_v3_RU.md)
- [Progression Compatibility Note RU](./docs/product/HABIDOO_Progression_Rewards_Level_100_RU.md)
- [Codex Local Setup RU](./docs/dev/CODEX_LOCAL_SETUP_RU.md)
- [First Local Codex Task: Global Sync RU](./docs/dev/CODEX_FIRST_TASK_GLOBAL_SYNC_RU.md)
