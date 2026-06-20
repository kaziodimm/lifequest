# Habidoo — current handoff

## Repository and deployment

- Repository: `kaziodimm/lifequest`
- Working branch: `codex/tree-constellation-polish`
- Production branch: `main`
- Production URL: https://lifequest-gamma.vercel.app/tree
- Vercel project: `prj_94A8lDCmvvFYwG6DUa0GsxCH6Hob`
- Vercel team: `team_tMqKBKkwpjBlShMCFxA1oLJ2`

## Current design state

- The Life Tree has five themes: Orbit, Atlas, Nexus, Blueprint and Pulse.
- The Awakening Trial is a large theme-specific star outside the normal branch structure.
- Completed missions use an explicit green check seal.
- Branch names were removed from the canvas.
- Branch lines have distinct locked, available and completed states.
- Theme tooltips are equal in size and centered below their icons.
- Epoch navigation has previous/next controls and mobile snapping for all 12 epochs.
- The mission card is the highest interactive layer. Other controls disappear while it is open.

## Progression foundation

- All eight Trial nodes are one-time 30–90 minute mastery checks, not multi-day habit loops.
- Only one daily or Tree mission can be active; persisted duplicate active states are normalized safely.
- Every mission enforces minimum duration, a global cooldown tier and a personal cooldown.
- XP is balanced by mission depth. Normal nodes award modest XP, milestones award 125, Trials 250 and The Awakening Trial 500.
- Player state supports category Research Points and rare Insight Points.
- Reward bundles support XP, Research, Insight, badges, titles, theme unlocks, theme fragments, node frames and background effects.
- Trial readiness supports `requiredLevel`, `requiredInsightPoints`, `requiredCategoryProgress` and `requiredCompletedBranches`.
- Orbit is the default unlocked theme. Locked themes remain previewable and can be unlocked by rewards; Atlas is tied to The Awakening Trial.
- The mission panel displays action, steps, duration, personal/global cooldowns, rewards, counting rules and Trial lock reasons.

## Mobile stability work

- Coarse-pointer devices use a stable 2D canvas transform instead of `translate3d`.
- Background parallax is disabled on coarse-pointer devices to avoid compositor-layer flicker.
- Background artwork is oversized beyond the viewport to prevent uncovered black edges.
- Mobile disables ambient background animation, node drop shadows and backdrop blur.

## Verification checklist

- Run `pnpm run build`.
- Verify desktop and 390x844 mobile layouts in Chromium/Edge.
- On a physical phone, drag the map repeatedly to every edge and check for flicker or uncovered background.
- Open a mission on desktop and mobile; theme, zoom, epoch and bottom navigation must not cover it.
- Use epoch arrows repeatedly; `New Horizon` must become fully visible.
- Confirm the latest `main` deployment is `READY` before reporting completion.

## Next product steps after visual polish

1. Add backend persistence and server-authoritative mission timestamps before public leaderboards.
2. Build Inner Order chapter content using the new progression and reward fields.
3. Add a dedicated wallet/reward inventory UI for Research, Insight and cosmetics.
4. Validate real-device performance on iOS Safari and Android Chrome.
5. Add automated progression and visual regression tests.

Read this file first when continuing in a new Codex thread.
