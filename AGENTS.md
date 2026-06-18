# Codex Instructions for Habidoo

This repository contains Habidoo, a mobile-first Life Strategy Game. Treat GitHub as the source of truth for the project.

## Working Style

- Respond to the project owner in Russian by default.
- Keep updates short, clear, and step-by-step.
- If the owner writes "продолжай", continue with the next logical implementation step without long clarification.
- Work incrementally: MVP first, then polish, deploy, test, fix, repeat.
- Do not mix this project with Taskovo or reuse Taskovo assumptions.
- Preserve the existing architecture where possible. Do not rebuild the app from scratch unless explicitly requested.

## Required Reading Before Product or Design Work

Before changing product direction, UI, visual style, or core mechanics, read:

1. `VISION.md`
2. `ART_DIRECTION.md`
3. `DESIGN_DIRECTION.md`
4. `PRODUCT_BRIEF.md`
5. `TECH_ARCHITECTURE.md`

For deployment or infrastructure work, also read:

- `DEPLOYMENT.md`
- `MOBILE_APP_STRATEGY.md`
- `ROADMAP.md`

## Product Rule

Habidoo is not a habit tracker.

Habidoo is not a task manager.

Habidoo is not a todo list.

Habidoo is a Life Strategy Game.

The Life Tree is the product. Everything else supports the Life Tree.

If a feature does not support the Life Tree, missions, technologies, eras, progression, unlock desire, or meaningful real-life development, question it before implementation.

## Visual Rule

The Life Tree must not look like a dashboard, spreadsheet, card list, or generic productivity template.

The target feeling is a premium game-grade progression map:

- fullscreen
- mobile-first
- dark by default
- open-map feeling
- free pan and zoom
- central life core
- branches spreading outward
- generated/custom background art
- custom icons and node frames
- selected-node focus
- fixed mission panel
- visible future progression
- strong theme identity

The five visual styles must be full thematic skins, not simple color swaps. Each style should differ in background art direction, icon language, node frames, connection style, panel framing, and animation tone.

Do not copy any existing game UI directly. Use games only as references for principles and quality.

## Current Priority

The current priority is visual quality of the Life Tree screen.

Before adding backend, payments, social features, leaderboards, or complex statistics, make the Life Tree feel like the core game screen.

Main current visual goals:

1. Make uploaded/generated theme backgrounds clearly visible and meaningful.
2. Make node icons and frames feel custom, not plain circles.
3. Make the map feel like an open star chart, not a boxed component.
4. Keep bottom navigation usable and never blocked by panels.
5. Make the mission panel fixed, readable, and theme-framed.
6. Preserve mobile-first ergonomics.

## Engineering Rules

- Stack: Next.js, React, TypeScript, Tailwind CSS, Zustand, localStorage for MVP.
- No backend for version 1 unless explicitly requested.
- Prepare architecture for future Supabase, Resend, Stripe, leaderboards, guilds, verification, and mobile app monetization, but do not implement those early.
- Prefer focused, small commits.
- Avoid unrelated refactors.
- Keep TypeScript clean.
- Keep localStorage MVP behavior working.
- Preserve PWA/mobile-first direction.

## GitHub and Vercel Workflow

- Repository: `kaziodimm/lifequest`.
- Main branch deploys to Vercel.
- After code changes, check the Vercel deployment status.
- If a deployment fails, inspect the error before continuing visual or product work.
- Production URL: `https://lifequest-gamma.vercel.app/`.

## UX Principle

Every important action should answer:

1. What do I do now?
2. Why does it matter?
3. What technology does it progress?
4. What does it unlock?

The user should feel: "I am unlocking my life."