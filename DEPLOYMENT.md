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

Version 1 does not need backend environment variables.

Future variables:

```txt
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
RESEND_API_KEY=
NEXT_PUBLIC_APP_URL=
```

Do not add these until Supabase/Resend are actually introduced.

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
