# Habidoo Technical Architecture

## Stack

Core stack:

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- Supabase
- Vercel
- Resend

Later:

- Analytics provider
- Stripe if web premium is added
- Mobile wrapper or native app strategy

## Hosting

Use Vercel for:

- preview deployments
- production deployment
- environment variables
- analytics if selected
- GitHub integration

## Repository

GitHub repository:

- kaziodimm/lifequest

Project name in product docs:

- Habidoo

The repository name can stay `lifequest` during early development or be renamed later.

## App Structure

Recommended structure:

```txt
app/
  [locale]/
    page.tsx
    dashboard/
    habits/
    tasks/
    profile/
    stats/
    settings/
  api/
components/
  ui/
  layout/
  game/
  forms/
lib/
  supabase/
  i18n/
  theme/
  xp/
  analytics/
  email/
  utils/
database/
  migrations/
  schema.sql
public/
  icons/
  mascots/
  themes/
```

## Supabase

Use Supabase for:

- authentication
- user profiles
- habits
- daily tasks
- completions
- XP events
- user settings

### Suggested Tables

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

#### habits

- id uuid primary key
- user_id uuid references auth.users
- title text
- description text
- xp_reward integer
- color text
- icon text
- active boolean
- created_at timestamp
- updated_at timestamp

#### habit_completions

- id uuid primary key
- user_id uuid references auth.users
- habit_id uuid references habits
- completed_on date
- xp_awarded integer
- created_at timestamp

Unique index:

- user_id, habit_id, completed_on

#### daily_tasks

- id uuid primary key
- user_id uuid references auth.users
- title text
- tiny_step text
- status text
- important boolean
- planned_for date
- xp_awarded integer
- created_at timestamp
- updated_at timestamp

Status values:

- planned
- completed
- partial
- failed
- skipped

#### xp_events

- id uuid primary key
- user_id uuid references auth.users
- source_type text
- source_id uuid
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

Policy rule:

- users can only select, insert, update, and delete their own rows.

## Resend

Use Resend for:

- welcome email
- future reminders
- retention emails
- product updates

MVP can prepare the integration but does not need complex email automation.

## Localization

Build i18n from the start.

Default locale:

- cs

Planned locales:

- en
- ru
- uk

Translation files can start as simple dictionaries and later move to a more advanced i18n solution if needed.

## Theme System

Themes should be token-based.

Each theme should define:

- background
- surface
- card
- text
- muted text
- primary
- secondary
- success
- warning
- danger
- border
- glow/shadow

MVP themes:

- focus-dark
- soft-light

Future themes:

- pixel-quest
- cyber-calm
- nature-progress

## XP Logic

Centralize XP logic in `lib/xp`.

Initial rules:

- completed habit: habit xp_reward
- completed task: default task XP
- partial task: smaller XP
- failed important task: optional penalty later
- level = based on total XP thresholds

Avoid scattering XP calculations across UI components.

## Analytics

Track events:

- app_opened
- signup_completed
- habit_created
- habit_completed
- task_created
- task_completed
- tiny_step_used
- xp_earned
- level_up
- theme_changed
- locale_changed
- returned_next_day

Main retention metric:

- Day 1 return
- Day 7 retention

## Deployment Flow

1. Push code to GitHub.
2. Connect repository to Vercel.
3. Create Supabase project.
4. Add env vars to Vercel.
5. Run migrations.
6. Deploy preview.
7. Test auth and data.
8. Promote to production.

## Environment Variables

Expected variables:

```txt
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
RESEND_API_KEY=
NEXT_PUBLIC_APP_URL=
```

Do not commit secrets.

## Quality Rules

- Mobile-first UI.
- Strong loading and empty states.
- No broken unauthenticated routes.
- Czech default copy.
- Auth and database protected by RLS.
- No payment or ad logic before retention is tested.
