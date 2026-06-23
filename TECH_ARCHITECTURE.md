# Habidoo Technical Architecture

## Current Architecture

Version 1 is a local-first Life Strategy MVP.

Core stack:

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- shadcn/ui-style source components
- Recharts
- Zustand
- localStorage
- Vercel

No backend is required for version 1.

Future stack:

- Supabase for auth, database, and sync
- Resend for email flows
- Analytics provider
- Stripe only if web premium is introduced
- Mobile wrapper or PWA-first app strategy

## Hosting

Use Vercel for:

- preview deployments
- production deployment
- domain connection
- environment variables later
- analytics if selected
- GitHub integration

## Repository

GitHub repository:

- kaziodimm/lifequest

Product name:

- Habidoo

The repository name can stay `lifequest` during early development or be renamed later.

## Current App Structure

```txt
app/
  page.tsx
  tree/
  command/
  stats/
  profile/
components/
  ui/
  app-shell.tsx
  life-tree.tsx
lib/
  store.ts
  types.ts
  life-tree.ts
  progression.ts
  insights.ts
  themes.ts
  i18n.ts
  utils.ts
public/
  icon.svg
  manifest.json
```

## State Model

Version 1 uses Zustand with localStorage persistence.

Stored state:

- avatarName
- locale
- theme
- totalXp
- streak
- completedTechnologyIds
- dailyMissions
- planner
- achievements
- progressHistory

## Core Domain Model

### LifeTechnology

Each technology has:

- id
- category
- title
- description
- XP reward
- requirements
- parents
- unlocks
- x/y tree position

### DailyMission

Daily missions are not the product. They are fuel for the Life Tree.

Each mission has:

- title
- tiny first step
- linked technology
- importance flag
- completion state
- XP reward

### PlannerBlock

The 24-hour planner supports daily execution.

Each block has:

- hour
- plan
- linked technology
- completion state

## Supabase Future Architecture

Add Supabase after the local MVP proves the Life Tree loop.

Use Supabase for:

- authentication
- user profiles
- cloud sync
- Life Tree progress
- daily missions
- planner blocks
- XP events
- settings
- future leaderboards and guilds

### Future Tables

#### profiles

- id uuid primary key references auth.users
- display_name text
- locale text
- theme text
- total_xp integer
- level integer
- current_streak integer
- created_at timestamp
- updated_at timestamp

#### user_technologies

- id uuid primary key
- user_id uuid references auth.users
- technology_id text
- status text
- unlocked_at timestamp
- xp_awarded integer

#### daily_missions

- id uuid primary key
- user_id uuid references auth.users
- technology_id text
- title text
- tiny_step text
- important boolean
- completed boolean
- planned_for date
- xp_reward integer
- created_at timestamp
- updated_at timestamp

#### planner_blocks

- id uuid primary key
- user_id uuid references auth.users
- planned_for date
- hour integer
- plan text
- technology_id text
- completed boolean
- xp_awarded integer
- created_at timestamp
- updated_at timestamp

#### xp_events

- id uuid primary key
- user_id uuid references auth.users
- source_type text
- source_id text
- amount integer
- reason text
- created_at timestamp

#### user_settings

- user_id uuid primary key references auth.users
- locale text
- theme text
- email_notifications boolean
- created_at timestamp
- updated_at timestamp

## Row Level Security

Every user-owned table must enable RLS.

Rule:

- users can only select, insert, update, and delete their own rows.

## Resend Future Use

Use Resend later for:

- welcome email
- onboarding nudges
- reminder experiments
- retention emails
- product updates

Do not add email automation before the MVP loop is validated.

## Localization

Build i18n from the beginning.

Current planned locales:

- en
- cs
- ru
- uk

The current implementation starts with a simple dictionary in `lib/i18n.ts`.

## Theme System

Theme architecture starts in `lib/themes.ts`.

Themes:

- focus-dark
- soft-light
- pixel-quest
- cyber-calm
- nature-progress

MVP implementation starts with Focus Dark while keeping the UI ready for other modes.

## XP Logic

Centralized in:

- `lib/progression.ts`
- `lib/store.ts`

Initial rules:

- completed mission gives mission XP
- completed planner block gives small XP
- unlocked technology gives technology XP
- levels scale progressively

## Analytics Future Events

Track later:

- app_opened
- life_tree_opened
- mission_completed
- planner_block_completed
- technology_unlocked
- xp_earned
- level_up
- theme_changed
- locale_changed
- returned_next_day

Main metric:

> Does the user return to progress the Life Tree?

## Deployment Flow

1. Push code to GitHub.
2. Import repository into Vercel.
3. Deploy preview.
4. Fix build errors from Vercel logs.
5. Test mobile UI.
6. Connect domain.
7. Restore CI only after Vercel build is stable.

## Environment Variables

Local-only progress works without backend variables.

Cloud accounts require:

```txt
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
```

Do not commit secrets. Never expose a Supabase `service_role` or secret key in browser code or `NEXT_PUBLIC_*` variables.

## Quality Rules

- Mobile-first UI.
- The Life Tree must remain central.
- No broken navigation routes.
- No backend dependency in v1.
- No payment or ad logic before retention is tested.
- No CI spam during early online setup.
