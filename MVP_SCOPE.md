# Habidoo MVP Scope

## Goal

Build a beautiful, mobile-first web MVP that proves whether users want to return daily to complete habits and tasks in a playful XP-based system.

The MVP should be simple enough to ship quickly, but polished enough to show in short-form videos.

## In Scope

### Auth

- Supabase email/password auth.
- Optional magic link later.
- Basic user profile record.

### Dashboard

- Today's progress.
- Current XP.
- Current level.
- Streak.
- Today's habits completed.
- Today's tasks completed.
- Tiny start prompt.

### Habits

- Create habit.
- Edit habit.
- Complete habit for today.
- XP reward per habit.
- Completion history.

### Daily Tasks

- Create daily task.
- Add tiny first step.
- Mark as completed, partial, skipped, or failed.
- Important flag.
- XP and optional penalty logic.

### XP and Levels

- XP for completed tasks.
- Smaller XP for partial progress.
- XP for completed habits.
- Level calculation.
- Progress to next level.

### Streaks

- Daily streak based on completing at least one habit or task.
- Display current streak.

### Themes

MVP themes:

- Focus Dark
- Soft Light

Architecture should allow adding:

- Pixel Quest
- Cyber Calm
- Nature Progress

### Localization

MVP language system:

- Czech default
- English included if time allows in first pass

Next languages:

- Russian
- Ukrainian

### Statistics

- 7-day completion view.
- 30-day simple progress chart.

### Settings

- Language switch.
- Theme switch.
- Basic profile settings.

## Out of Scope for MVP

- Mobile app store builds.
- Ads.
- Stripe payments.
- Complex avatar customization.
- Social features.
- Teams.
- Public leaderboards.
- AI coach.
- Push notifications.
- Advanced calendars.
- Marketplace.

## Technical Requirements

- Next.js App Router.
- TypeScript.
- Tailwind CSS.
- Supabase auth and database.
- Vercel deployment.
- Resend prepared, but email flows can be minimal at first.
- Analytics added early.

## MVP Quality Bar

The MVP should feel:

- fast
- clear
- playful
- mobile-first
- visually memorable
- usable without explanation

It should not feel like a blank template.

## First Test Flow

A new user should be able to:

1. Open landing page.
2. Understand what Habidoo does.
3. Create account.
4. Create first habit.
5. Create first task with tiny step.
6. Complete one item.
7. Earn XP.
8. See level/streak progress.
9. Change theme or language.
