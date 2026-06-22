import type { Locale, MissionAttempt, MissionDefinition, MissionStatus, TechnologyRuntime, UserFocusObject, VisualThemeId } from "./types.ts";
import { hasRequiredMissionAnswers } from "./missions.ts";

export function canStartMission(options: { locked: boolean; completed: boolean; globalCooldownUntil?: number; runtime?: TechnologyRuntime; hasAnotherActiveMission: boolean; now: number }) {
  if (options.locked || options.completed || options.hasAnotherActiveMission) return false;
  if (options.runtime?.status === "active") return false;
  if (options.runtime?.cooldownUntil && options.runtime.cooldownUntil > options.now) return false;
  if (options.globalCooldownUntil && options.globalCooldownUntil > options.now) return false;
  return true;
}

export function canCompleteMissionAttempt(definition: MissionDefinition, attempt: MissionAttempt | undefined, runtime: TechnologyRuntime | undefined, now: number) {
  if (!attempt || attempt.completedAt || !runtime?.startedAt || runtime.status !== "active") return false;
  if (Math.floor((now - runtime.startedAt) / 1000) < definition.minimumDurationSeconds) return false;
  return hasRequiredMissionAnswers(definition, attempt.answers);
}

export function completeAttemptOnce(attempt: MissionAttempt, completedAt: number, elapsedSeconds: number, rewards: MissionAttempt["earnedRewards"]) {
  return attempt.completedAt ? attempt : { ...attempt, completedAt, elapsedSeconds, earnedRewards: rewards };
}

export function findReusableFocusObject(focusObjects: UserFocusObject[], category: UserFocusObject["category"]) {
  return focusObjects.find((focusObject) => focusObject.category === category);
}

export function recommendUnlocked<T extends { locked: boolean; completed: boolean; status?: MissionStatus }>(items: T[], limit = 3) {
  return items.filter((item) => !item.locked && !item.completed && item.status !== "active").slice(0, limit);
}

export function migrateLocale(locale: unknown): Locale {
  return (["en", "ru", "cs", "uk"] as const).includes(locale as Locale) ? locale as Locale : "en";
}

export function migrateThemeId(theme: unknown): VisualThemeId {
  const aliases: Record<string, VisualThemeId> = { "focus-dark": "animus-dark", "soft-light": "mirage-atlas", "pixel-quest": "arcade-codex", "cyber-calm": "neon-synapse", "nature-progress": "verdant-relic" };
  const canonical = ["animus-dark", "mirage-atlas", "arcade-codex", "neon-synapse", "verdant-relic"];
  if (typeof theme === "string" && canonical.includes(theme)) return theme as VisualThemeId;
  return aliases[String(theme)] ?? "animus-dark";
}

export function normalizePersistedMissionData(value: unknown) {
  const persisted = value && typeof value === "object" ? value as { missionAttempts?: unknown; focusObjects?: unknown } : {};
  return {
    missionAttempts: Array.isArray(persisted.missionAttempts) ? persisted.missionAttempts : [],
    focusObjects: Array.isArray(persisted.focusObjects) ? persisted.focusObjects : []
  };
}
