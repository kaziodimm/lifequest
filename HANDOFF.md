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

1. Rework mission content and progression balance for the remaining chapters.
2. Validate real-device performance on iOS Safari and Android Chrome.
3. Add automated visual regression tests for desktop and mobile Tree layouts.
4. Continue accessibility and keyboard-navigation review.

Read this file first when continuing in a new Codex thread.
