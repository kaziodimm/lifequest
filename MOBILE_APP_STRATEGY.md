# Habidoo Mobile App Strategy

## Principle

Habidoo should be designed as a mobile product from the beginning, even while version 1 ships as a web/PWA MVP.

The web MVP should validate the core loop:

> Users return to progress their Life Tree.

Only after that should the project invest in app store distribution and monetization.

## Phase 1: PWA MVP

Goals:

- Installable web app.
- Strong mobile layout.
- Works well on iPhone and Android browsers.
- localStorage persistence.
- Fast first open.
- No backend required.

Current setup:

- `public/manifest.json`
- `public/icon.svg`
- mobile-first navigation
- Vercel-ready Next.js app

## Phase 2: Account and Sync

Add after the Life Tree loop is validated:

- Supabase auth.
- Cloud save.
- Multi-device sync.
- User profile.
- Progress events.
- Analytics.

## Phase 3: Mobile Wrapper

Evaluate:

- PWA only
- Capacitor wrapper
- React Native later only if needed

PWA first is preferred because it is faster and cheaper.

## Phase 4: Monetization

Possible mobile revenue paths:

- Rewarded ads.
- No-ads premium.
- Paid visual themes.
- Cosmetic tree skins.
- Avatar/profile cosmetics.
- Streak protection token.

Core Life Tree progression should remain free.

## Phase 5: App Store Launch

Before Google Play / App Store:

- Stable retention.
- Clear onboarding.
- Good mobile performance.
- Privacy policy.
- Terms.
- App icon.
- Screenshots.
- Short demo videos.
- Analytics and crash/error tracking.

## Ad Placement Rules

Ads must not break the premium strategy feel.

Acceptable:

- Optional rewarded ads.
- Cosmetic unlock boosters.
- Streak shield reward.

Avoid:

- Banner ads inside the Life Tree.
- Interstitial ads after every action.
- Ads that make the product feel cheap.

The Life Tree is the product. Ads must support it, not pollute it.
