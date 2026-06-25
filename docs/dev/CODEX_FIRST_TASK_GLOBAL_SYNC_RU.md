# Habidoo — First Local Codex Task: Global Cloud Sync RU

Version: 1.0
Date: 2026-06-25
Priority: P0 / beta blocker

## 0. Прочитать перед кодом

Перед реализацией прочитать:

1. `HANDOFF.md`
2. `docs/product/HABIDOO_Product_Logic_v3_RU.md`
3. `docs/dev/CODEX_LOCAL_SETUP_RU.md`
4. `components/cloud-account-panel.tsx`
5. `components/app-shell.tsx`
6. `lib/store.ts`
7. `lib/auth-state.ts`
8. `lib/supabase/client.ts`
9. `lib/supabase/server.ts`
10. `supabase/migrations/20260623150000_auth_cloud_save_mvp.sql`
11. `tests/mission-rules.test.ts`

## 1. Problem

Progress is not reliably synchronized between devices.

Observed user problem:

```text
Desktop: mission/progress completed.
Phone: same account does not show that progress.
```

Likely current architecture problem:

```text
Cloud sync logic is inside CloudAccountPanel.
CloudAccountPanel is mounted only on Profile.
If user completes missions on Tree/Command, autosync may not run.
```

This is unacceptable for beta.

## 2. Goal

Implement global cloud sync for authenticated confirmed users with Habid/profile.

Progress changed on any protected app page must be saved to Supabase and restored on another device.

## 3. Required behavior

### 3.1 Global sync provider

Create a global sync layer, for example:

```text
components/cloud-sync-provider.tsx
lib/cloud-sync.ts
```

Mount it globally for authenticated app routes, likely inside `AppShell` or another top-level client provider.

It must work on:

- `/tree`
- `/command`
- `/stats`
- `/achievements`
- `/profile`

It must not depend on opening Profile.

### 3.2 Initial cloud load

On authenticated confirmed user:

1. Load `profiles` row.
2. Load `user_game_state` row.
3. Wait until Zustand persisted local state is hydrated.
4. Compare local state and cloud state.
5. Decide restore/upload/conflict.

Do not save local state before initial cloud load is resolved.

### 3.3 Never overwrite newer account progress with empty local state

A new phone/device may have empty localStorage.

If server has real progress and local device is empty/new, restore server state automatically.

Do not upload empty local state over server state.

### 3.4 Conflict handling

Need conservative conflict resolution.

Recommended metadata:

Add to PlayerState or separate sync metadata:

```ts
lastLocalMutationAt?: number;
lastCloudSyncAt?: number;
lastCloudStateUpdatedAt?: string;
```

Alternative: keep metadata in CloudSyncProvider local state if sufficient, but persistent local metadata is preferred.

Rules:

- If no cloud state exists: upload local snapshot after profile exists.
- If cloud state exists and local state is empty/new: restore cloud state.
- If cloud state exists and cloud `updated_at` is newer than local mutation/sync marker: restore cloud state or show conflict if uncertain.
- If local state is clearly newer: upload local snapshot.
- If both changed and cannot be safely resolved: show conflict UI.

### 3.5 Conflict UI

CloudAccountPanel can show conflict choices, but provider should own the sync state.

User choices:

- Use account progress
- Keep this device progress

Do not hide conflict in console only.

### 3.6 Debounced autosave

After initial load is resolved and sync is enabled:

- subscribe to relevant Zustand state changes;
- debounce 800-1500 ms;
- save snapshot to `user_game_state`;
- update sync status.

Avoid saving on every render.

Avoid infinite loop:

```text
restoreCloudState -> Zustand changes -> immediate stale upload
```

Use a suppress flag or mark restore as cloud-originated.

### 3.7 Sync status

Expose compact sync status:

```ts
type CloudSyncStatus =
  | "disabled"
  | "loading"
  | "needs_profile"
  | "restoring"
  | "syncing"
  | "synced"
  | "conflict"
  | "error";
```

Profile can display:

- Syncing...
- Synced
- Account progress found
- Conflict needs review
- Offline / will retry

Do not show noisy status on every page yet.

## 4. Refactor CloudAccountPanel

`CloudAccountPanel` should remain account UI:

- signup;
- login;
- Habid creation;
- logout;
- sync status display;
- conflict action buttons.

But permanent autosync must move out of it.

Do not keep duplicate sync loops in both provider and panel.

## 5. Supabase security constraints

Do not expose service role key.

Use only:

```text
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
```

Existing RLS should remain:

- users can only select/insert/update own `profiles` row;
- users can only select/insert/update own `user_game_state` row;
- anon has no grants.

If SQL changes are needed, create a migration and explain why.

Expected: this task likely does not need schema change except maybe adding sync metadata in JSON state.

## 6. Tests

Add or update tests where practical.

At minimum cover helper functions if sync decision logic is extracted:

1. server has progress + local empty -> restore server;
2. no server state -> upload local;
3. local newer -> upload local;
4. server newer -> restore server;
5. uncertain both changed -> conflict;
6. restore does not immediately schedule stale upload;
7. cloud snapshot includes new PlayerState keys safely.

If existing test harness is only `tests/mission-rules.test.ts`, add pure helper tests there or create a new Node test file and update `package.json` test script carefully.

## 7. Manual QA

After implementation, test manually:

### Desktop -> phone

1. Login on desktop.
2. Complete a mission or change visible progress.
3. Wait for status `Synced`.
4. Login same account on phone/incognito.
5. Progress must appear.

### Phone -> desktop

1. Complete mission/change progress on phone.
2. Wait for `Synced`.
3. Refresh desktop.
4. Progress must appear.

### Empty device safety

1. Clear localStorage on second device.
2. Login.
3. Existing account progress must restore.
4. Empty state must not overwrite server.

### Conflict

1. Simulate local progress while server has newer state.
2. UI must offer `Use account progress` / `Keep this device progress`.

## 8. Verification commands

Run:

```bash
pnpm test
pnpm typecheck
pnpm build
```

If using npm by accident, switch back to pnpm because repo has `pnpm-lock.yaml`.

## 9. HANDOFF update required

After implementation update `HANDOFF.md` with:

- files changed;
- where global sync provider lives;
- sync decision rules;
- conflict behavior;
- tests run;
- manual QA done/not done;
- remaining sync limitations.

## 10. Do not do in this pass

Do not implement:

- lesson-chain mission rewrite;
- guide system redesign;
- inventory;
- notifications;
- landing redesign;
- new themes;
- new era visuals;
- shop/subscriptions.

This pass is only global cloud sync reliability.
