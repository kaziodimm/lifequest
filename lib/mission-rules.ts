import type { LifeCategory, LifeTechnology, Locale, MissionAnswer, MissionAttempt, MissionDefinition, MissionInput, MissionStatus, PlayerState, TechnologyRuntime, UserFocusObject, VisualThemeId } from "./types.ts";

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
  return validateMissionAnswers(definition, attempt.answers).valid;
}

export function completeAttemptOnce(attempt: MissionAttempt, completedAt: number, elapsedSeconds: number, rewards: MissionAttempt["earnedRewards"]) {
  return attempt.completedAt ? attempt : { ...attempt, completedAt, elapsedSeconds, earnedRewards: rewards };
}

export function findReusableFocusObject(focusObjects: UserFocusObject[], category: UserFocusObject["category"]) {
  return [...focusObjects]
    .filter((focusObject) => focusObject.category === category)
    .sort((a, b) => (b.updatedAt ?? b.createdAt) - (a.updatedAt ?? a.createdAt))[0];
}

export function recommendUnlocked<T extends { locked: boolean; completed: boolean; status?: MissionStatus; category?: LifeCategory; progress?: number; hasFocus?: boolean; isMilestone?: boolean; cooldownUntil?: number }>(items: T[], options: { primaryCategory?: LifeCategory; now?: number; limit?: number } = {}) {
  const now = options.now ?? Date.now();
  return items
    .filter((item) => !item.locked && !item.completed && item.status !== "active" && (!item.cooldownUntil || item.cooldownUntil <= now))
    .sort((a, b) => {
      const score = (item: T) =>
        (item.category && item.category === options.primaryCategory ? 100 : 0) +
        (item.hasFocus ? 35 : 0) +
        (item.isMilestone ? 25 : 0) +
        (item.progress ?? 0) * 5;
      return score(b) - score(a);
    })
    .slice(0, options.limit ?? 3);
}

function isBlank(value: unknown) {
  return typeof value !== "string" || value.trim().length === 0;
}

function isValidUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function isValidDateLike(value: string, type: MissionInput["type"]) {
  if (isBlank(value)) return false;
  if (type === "time") return /^([01]\d|2[0-3]):[0-5]\d$/.test(value);
  const timestamp = Date.parse(value);
  return Number.isFinite(timestamp);
}

export function validateMissionAnswers(definition: MissionDefinition, answers: Record<string, unknown>) {
  const errors: Record<string, string> = {};

  definition.inputSchema.forEach((input) => {
    const value = answers[input.id];
    const choices = new Set((input.choices ?? []).map((choice) => choice.id));
    const fail = (message: string) => { errors[input.id] = message; };

    if (input.required) {
      if (Array.isArray(value) && value.length === 0) fail("Required answer");
      else if (typeof value === "boolean" && value !== true) fail("Required confirmation");
      else if (typeof value === "number" && !Number.isFinite(value)) fail("Required number");
      else if (value === undefined || value === null || (typeof value === "string" && value.trim().length === 0)) fail("Required answer");
    }

    if (value === undefined || value === null || errors[input.id]) return;

    if (input.type === "singleChoice") {
      if (typeof value !== "string" || (!input.allowCustomChoice && !choices.has(value))) fail("Invalid choice");
      if (input.allowCustomChoice && isBlank(value)) fail("Required answer");
    }
    if (input.type === "multiChoice" || input.type === "checklist") {
      if (!Array.isArray(value)) fail("Invalid choices");
      else if (value.some((item) => typeof item !== "string" || (choices.size > 0 && !choices.has(item)))) fail("Invalid choices");
      else if (input.required && value.length === 0) fail("Required choices");
    }
    if (input.type === "confirmation" && value !== true) fail("Required confirmation");
    if (input.type === "rating" || input.type === "number") {
      if (typeof value !== "number" || !Number.isFinite(value)) fail("Invalid number");
      else if (input.min !== undefined && value < input.min) fail("Number below minimum");
      else if (input.max !== undefined && value > input.max) fail("Number above maximum");
      else if (input.id.includes("balance") || input.id.includes("income") || input.id.includes("cost") || input.id.includes("spending") || input.id.includes("payment")) {
        if (value < 0) fail("Financial values cannot be negative here");
      }
    }
    if ((input.type === "shortText" || input.type === "text") && typeof value !== "string") fail("Invalid text");
    if (input.type === "link" && (typeof value !== "string" || !isValidUrl(value))) fail("Invalid URL");
    if ((input.type === "dateOrTime" || input.type === "date" || input.type === "time") && (typeof value !== "string" || !isValidDateLike(value, input.type))) fail("Invalid date or time");
  });

  return { valid: Object.keys(errors).length === 0, errors };
}

export function buildEvidenceSummary(definition: MissionDefinition, answers: Record<string, MissionAnswer>) {
  const required = definition.inputSchema.filter((input) => input.required);
  const parts = required.flatMap((input) => {
    const value = answers[input.id];
    if (value === undefined || value === false || value === "") return [];
    const readable = Array.isArray(value) ? value.join(", ") : value === true ? "confirmed" : String(value).trim();
    return readable ? [`${input.label}: ${readable}`] : [];
  });
  return parts.slice(0, 4).join(" · ") || definition.concreteOutcome;
}

export function sanitizeEvidenceAnswers(answers: Record<string, MissionAnswer>) {
  return Object.fromEntries(Object.entries(answers).filter(([key]) => !/(balance|income|cost|spending|payment)/i.test(key)));
}

export function completedBranchCategories(state: Pick<PlayerState, "missionAttempts" | "completedTechnologyIds">, technologies: LifeTechnology[]) {
  const categories = new Set<LifeCategory>();
  technologies.forEach((technology) => {
    if (technology.id === "awakening-trial") return;
    if (state.completedTechnologyIds.includes(technology.id) && technology.parents.length === 0) categories.add(technology.category);
  });
  return [...categories];
}

export function completedPracticeAttempts(state: Pick<PlayerState, "missionAttempts">) {
  return state.missionAttempts.filter((attempt) => attempt.completedAt && attempt.evidence?.summary && attempt.technologyId !== "awakening-trial");
}

export function canCompleteAwakeningTrial(state: Pick<PlayerState, "missionAttempts" | "completedTechnologyIds" | "focusObjects">, technologies: LifeTechnology[], attempt: MissionAttempt | undefined) {
  if (!attempt) return false;
  const branches = completedBranchCategories(state, technologies);
  const practices = completedPracticeAttempts(state);
  const selected = attempt.answers["carried-practices"];
  const selectedIds = Array.isArray(selected) ? selected : [];
  const validSelected = selectedIds.filter((id) => practices.some((practice) => practice.id === id));
  const personalRule = attempt.answers["personal-rule"];
  const weeklyStandard = attempt.answers["weekly-standard"];
  const reviewed = attempt.answers["reviewed-branches"];
  return branches.length >= 4 &&
    Array.isArray(reviewed) && reviewed.length >= 4 &&
    validSelected.length >= 3 &&
    typeof personalRule === "string" && personalRule.trim().length >= 8 &&
    typeof weeklyStandard === "string" && weeklyStandard.trim().length >= 8 &&
    state.focusObjects.length > 0;
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

function resetActiveRuntime(runtime: TechnologyRuntime): TechnologyRuntime {
  const { startedAt: _startedAt, ...rest } = runtime;
  return { ...rest, status: "ready" };
}

export function reconcileActiveMissionState(options: { technologyRuntime: Record<string, TechnologyRuntime>; activeMissionAttemptId?: string; missionAttempts: MissionAttempt[] }) {
  const activeRuntimeIds = Object.entries(options.technologyRuntime)
    .filter(([, runtime]) => runtime.status === "active")
    .map(([technologyId]) => technologyId);
  if (activeRuntimeIds.length === 0) return { technologyRuntime: options.technologyRuntime, activeMissionAttemptId: undefined };

  const activeAttempt = options.activeMissionAttemptId
    ? options.missionAttempts.find((attempt) => attempt.id === options.activeMissionAttemptId)
    : undefined;
  const validActiveTechnologyId = activeAttempt && activeRuntimeIds.includes(activeAttempt.technologyId)
    ? activeAttempt.technologyId
    : undefined;

  const technologyRuntime = { ...options.technologyRuntime };
  activeRuntimeIds.forEach((technologyId) => {
    if (technologyId !== validActiveTechnologyId) {
      technologyRuntime[technologyId] = resetActiveRuntime(technologyRuntime[technologyId]);
    }
  });

  return {
    technologyRuntime,
    activeMissionAttemptId: validActiveTechnologyId ? options.activeMissionAttemptId : undefined
  };
}
