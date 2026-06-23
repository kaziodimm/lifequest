# Deployment Guide

## Current Status

Habidoo is currently in online MVP setup.

GitHub Actions CI is disabled temporarily to avoid repeated failure emails while the project is being created through GitHub API commits.

Build verification should happen first through Vercel deployment logs. After the first stable Vercel deployment, CI can be restored with a clean lockfile and known working build command.

## Vercel Setup

1. Open Vercel.
2. Import GitHub repository:
   - `kaziodimm/lifequest`
3. Framework preset:
   - Next.js
4. Install command:
   - `npm install`
5. Build command:
   - `npm run build`
6. Output directory:
   - leave default

## Environment Variables

Local-only progress works without backend variables.

Cloud accounts require:

```txt
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
```

Do not add Supabase `service_role` or secret keys to `NEXT_PUBLIC_*` variables.

Supabase dashboard checklist:

- Apply `supabase/migrations/20260623150000_auth_cloud_save_mvp.sql`.
- Auth Site URL: `https://www.habidoo.com`.
- Redirect allow list: `https://www.habidoo.com/auth/confirm`, plus `http://localhost:3000/auth/confirm` for local testing.
- Enable email confirmation.
- Configure custom SMTP with Resend using the verified Habidoo sending domain. Resend credentials stay in Supabase, not in this repository.
- Paste `supabase/email-templates/habidoo-magic-link.html` into the Magic Link email template.
- Configure Auth rate limits in Supabase before public traffic; enable Turnstile/hCaptcha in the dashboard when a provider key is ready.

## First Deployment Checklist

After importing to Vercel:

- Check install logs.
- Check TypeScript errors.
- Check Next.js build errors.
- Open preview deployment on mobile viewport.
- Test navigation: Home, Tree, Command, Stats, Profile.
- Test localStorage interactions: complete mission, unlock technology, change language/theme.
- Test PWA manifest loads.

## Restore CI Later

Restore GitHub Actions after Vercel deploy is stable.

Recommended workflow:

```yaml
name: CI
on:
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
      - run: npm install
      - run: npm run typecheck
      - run: npm run build
```

Run CI on pull requests first, not every direct commit to main during early setup.
