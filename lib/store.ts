"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { technologies } from "./life-tree";
import { getGlobalCooldownSeconds, getMissionDefinition, getTechnologyMission, getTechnologyTarget } from "./missions";
import { getTechnologyLockReasons } from "./progression";
import { canCompleteMissionAttempt, canStartMission, findReusableFocusObject, migrateLocale, migrateThemeId, normalizePersistedMissionData } from "./mission-rules";
import { DailyMission, LifeCategory, Locale, MissionAnswer, MissionCompletionEvidence, PlayerState, ProgressionReward, ResearchPointBalances, TechnologyRuntime, UserFocusObject, VisualThemeId } from "./types";

const emptyResearchPoints: ResearchPointBalances = {
  health: 0,
  mind: 0,
  career: 0,
  business: 0,
  finance: 0,
  relationships: 0,
  creativity: 0
};

function addResearchPoints(current: ResearchPointBalances, reward?: ProgressionReward["researchPoints"]) {
  const next = { ...current };
  Object.entries(reward ?? {}).forEach(([category, amount]) => {
    next[category as LifeCategory] += amount ?? 0;
  });
  return next;
}

function addUnique(current: string[], value?: string) {
  return value && !current.includes(value) ? [...current, value] : current;
}

function answerText(value: MissionAnswer | undefined) {
  if (Array.isArray(value)) return value.join(", ");
  return value === undefined ? "" : String(value);
}

function focusObjectFromAttempt(category: LifeCategory, answers: Record<string, MissionAnswer>, now: number): UserFocusObject | undefined {
  const values: Partial<Record<LifeCategory, { type: UserFocusObject["type"]; name: string; outcome: string }>> = {
    health: { type: "healthRoutine", name: "Body awareness", outcome: answerText(answers["body-factor"]) },
    mind: { type: "learningTopic", name: "Current focus", outcome: answerText(answers["next-step"]) },
    finance: { type: "financialGoal", name: "Financial foundation", outcome: `Balance ${answerText(answers.balance)}; income ${answerText(answers.income)}` },
    business: { type: "project", name: answerText(answers["project-name"]), outcome: answerText(answers["desired-result"]) },
    career: { type: "careerSkill", name: answerText(answers["career-target"]), outcome: "Create visible career progress this chapter." },
    relationships: { type: "relationship", name: answerText(answers["person-name"]), outcome: answerText(answers["connection-outcome"]) },
    creativity: { type: "creativeMedium", name: answerText(answers["creative-medium"]), outcome: "Create and save a first visible draft." }
  };
  const value = values[category];
  if (!value?.name) return undefined;
  return { id: `focus:${category}:${now}`, type: value.type, category, name: value.name, desiredOutcome: value.outcome, createdAt: now };
}

function initialAnswersFromFocus(category: LifeCategory, focusObject: UserFocusObject | undefined): Record<string, MissionAnswer> {
  if (!focusObject) return {};
  if (category === "business") return { "project-type": focusObject.name, "project-name": focusObject.name, "desired-result": focusObject.desiredOutcome };
  if (category === "career") return { "career-target": focusObject.name };
  if (category === "relationships") return { "person-name": focusObject.name };
  if (category === "creativity") return { "creative-medium": focusObject.name };
  return {};
}

const initialMissions: DailyMission[] = [
  {
    id: "mission-walk",
    title: "Take a 10 minute walk",
    tinyStep: "Put shoes near the door",
    technologyId: "morning-walk",
    important: true,
    completed: false,
    status: "ready",
    xpReward: 20,
    minDurationSeconds: 600,
    globalCooldownType: "standard",
    personalCooldownSeconds: 12 * 60 * 60
  },
  {
    id: "mission-build",
    title: "Work on one project asset",
    tinyStep: "Open the project file",
    technologyId: "project-sprint",
    important: true,
    completed: false,
    status: "ready",
    xpReward: 30,
    minDurationSeconds: 900,
    globalCooldownType: "standard",
    personalCooldownSeconds: 4 * 60 * 60
  },
  {
    id: "mission-water",
    title: "Drink water before coffee",
    tinyStep: "Fill one glass",
    technologyId: "hydration",
    important: false,
    completed: false,
    status: "ready",
    xpReward: 10,
    minDurationSeconds: 60,
    globalCooldownType: "micro",
    personalCooldownSeconds: 8 * 60 * 60
  }
];

function createInitialTechnologyRuntime(completedTechnologyIds: string[]): Record<string, TechnologyRuntime> {
  return Object.fromEntries(
    technologies.map((tech) => {
      const completed = completedTechnologyIds.includes(tech.id);
      return [
        tech.id,
        {
          progress: completed ? getTechnologyTarget(tech) : tech.requirements[0]?.current ?? 0,
          status: completed ? "completed" : "ready"
        }
      ];
    })
  );
}

const legacyCompletedTechnologyIds = ["health-root", "business-root"];
const initialCompletedTechnologyIds: string[] = [];

const initialState: PlayerState = {
  avatarName: "Strategist",
  onboardingCompleted: false,
  primaryCategory: undefined,
  locale: "en",
  theme: "animus-dark",
  currentEra: "foundation",
  totalXp: 0,
  researchPoints: { ...emptyResearchPoints },
  insightPoints: 0,
  unlockedTreeThemeIds: ["orbit"],
  themeFragments: {},
  earnedBadges: [],
  earnedTitles: [],
  unlockedNodeFrames: [],
  unlockedBackgroundEffects: [],
  streak: 0,
  completedTechnologyIds: initialCompletedTechnologyIds,
  technologyRuntime: createInitialTechnologyRuntime(initialCompletedTechnologyIds),
  globalMissionCooldownUntil: undefined,
  activeMissionAttemptId: undefined,
  missionAttempts: [],
  focusObjects: [],
  dailyMissions: initialMissions,
  planner: Array.from({ length: 24 }, (_, hour) => ({ hour, plan: "", completed: false })),
  achievements: [
    { id: "first-command", title: "First Command", description: "Complete the first daily mission.", unlocked: false },
    { id: "three-day-streak", title: "3 Day Chain", description: "Reach a 3 day streak.", unlocked: false }
  ],
  progressHistory: [0, 0, 0, 0, 0, 0, 0]
};

type PartialMission = Partial<DailyMission> & Pick<DailyMission, "id">;

function normalizeMission(mission: PartialMission): DailyMission {
  const fallback = initialMissions.find((item) => item.id === mission.id) ?? initialMissions[0];
  const completed = Boolean(mission.completed);

  return {
    ...fallback,
    ...mission,
    completed,
    status: completed ? "completed" : mission.status ?? "ready",
    minDurationSeconds: mission.minDurationSeconds ?? fallback.minDurationSeconds
  };
}

function normalizeTechnologyRuntime(persisted: Partial<PlayerState> | undefined) {
  const savedCompletedIds = persisted?.completedTechnologyIds;
  const isLegacyDemo = savedCompletedIds?.length === legacyCompletedTechnologyIds.length && legacyCompletedTechnologyIds.every((id) => savedCompletedIds.includes(id));
  const validIds = new Set(technologies.map((technology) => technology.id));
  const hasRemovedTechnology = savedCompletedIds?.some((id) => !validIds.has(id));
  const completedIds = !savedCompletedIds || isLegacyDemo || hasRemovedTechnology ? initialState.completedTechnologyIds : savedCompletedIds;
  const base = createInitialTechnologyRuntime(completedIds);
  const saved = persisted?.technologyRuntime ?? {};

  return Object.fromEntries(
    technologies.map((tech) => {
      const savedRuntime = saved[tech.id];
      const completed = completedIds.includes(tech.id);
      return [
        tech.id,
        {
          ...base[tech.id],
          ...savedRuntime,
          progress: completed ? getTechnologyTarget(tech) : savedRuntime?.progress ?? base[tech.id].progress,
          status: completed ? "completed" : savedRuntime?.status ?? base[tech.id].status
        }
      ];
    })
  );
}

function normalizeState(persisted: Partial<PlayerState> | undefined): PlayerState {
  const normalizedMissionData = normalizePersistedMissionData(persisted);
  const missions = (persisted?.dailyMissions ?? initialState.dailyMissions).map((mission) => {
    const normalized = normalizeMission(mission);
    return normalized.status === "active" ? { ...normalized, status: "ready" as const, startedAt: undefined } : normalized;
  });
  const savedCompletedIds = persisted?.completedTechnologyIds;
  const isLegacyDemo = savedCompletedIds?.length === legacyCompletedTechnologyIds.length && legacyCompletedTechnologyIds.every((id) => savedCompletedIds.includes(id));
  const validIds = new Set(technologies.map((technology) => technology.id));
  const hasRemovedTechnology = savedCompletedIds?.some((id) => !validIds.has(id));

  const technologyRuntime = normalizeTechnologyRuntime(persisted);
  let activeMissionClaimed = false;
  Object.keys(technologyRuntime).forEach((technologyId) => {
    if (technologyRuntime[technologyId].status !== "active") return;
    if (activeMissionClaimed) technologyRuntime[technologyId] = { ...technologyRuntime[technologyId], status: "ready", startedAt: undefined };
    else activeMissionClaimed = true;
  });

  return {
    ...initialState,
    ...persisted,
    locale: migrateLocale(persisted?.locale),
    onboardingCompleted: persisted?.onboardingCompleted ?? Boolean(persisted),
    primaryCategory: persisted?.primaryCategory,
    theme: migrateThemeId(persisted?.theme),
    completedTechnologyIds: !savedCompletedIds || isLegacyDemo || hasRemovedTechnology ? initialState.completedTechnologyIds : savedCompletedIds,
    currentEra: persisted?.currentEra ?? initialState.currentEra,
    researchPoints: { ...emptyResearchPoints, ...(persisted?.researchPoints ?? {}) },
    insightPoints: persisted?.insightPoints ?? 0,
    unlockedTreeThemeIds: persisted?.unlockedTreeThemeIds ?? initialState.unlockedTreeThemeIds,
    themeFragments: persisted?.themeFragments ?? {},
    earnedBadges: persisted?.earnedBadges ?? [],
    earnedTitles: persisted?.earnedTitles ?? [],
    unlockedNodeFrames: persisted?.unlockedNodeFrames ?? [],
    unlockedBackgroundEffects: persisted?.unlockedBackgroundEffects ?? [],
    activeMissionAttemptId: persisted?.activeMissionAttemptId,
    missionAttempts: (normalizedMissionData.missionAttempts as PlayerState["missionAttempts"]).filter((attempt) => attempt?.id && attempt?.missionId && attempt?.technologyId && attempt?.startedAt),
    focusObjects: (normalizedMissionData.focusObjects as PlayerState["focusObjects"]).filter((object) => object?.id && object?.type && object?.category && object?.name),
    technologyRuntime,
    dailyMissions: missions,
    planner: persisted?.planner ?? initialState.planner,
    achievements: persisted?.achievements ?? initialState.achievements,
    progressHistory: persisted?.progressHistory ?? initialState.progressHistory
  };
}

type LifeStore = PlayerState & {
  completeOnboarding: (locale: Locale, category: LifeCategory, focusObject: UserFocusObject) => void;
  setLocale: (locale: Locale) => void;
  setTheme: (theme: VisualThemeId) => void;
  unlockTreeTheme: (themeId: string) => void;
  startMission: (missionId: string) => void;
  completeMission: (missionId: string) => void;
  startTechnologyMission: (technologyId: string) => void;
  completeTechnologyMission: (technologyId: string) => void;
  setMissionAnswer: (attemptId: string, inputId: string, value: MissionAnswer) => void;
  saveFocusObject: (focusObject: UserFocusObject) => void;
  unlockTechnology: (technologyId: string) => void;
  updatePlannerBlock: (hour: number, plan: string, technologyId?: string) => void;
  togglePlannerBlock: (hour: number) => void;
};

export const useLifeStore = create<LifeStore>()(
  persist(
    (set, get) => ({
      ...initialState,
      completeOnboarding(locale, category, focusObject) {
        set((state) => ({
          locale,
          onboardingCompleted: true,
          primaryCategory: category,
          focusObjects: [...state.focusObjects.filter((item) => item.category !== category), focusObject]
        }));
      },
      setLocale(locale) {
        set({ locale });
      },
      setTheme(theme) {
        set({ theme });
      },
      unlockTreeTheme(themeId) {
        set((state) => ({ unlockedTreeThemeIds: state.unlockedTreeThemeIds.includes(themeId) ? state.unlockedTreeThemeIds : [...state.unlockedTreeThemeIds, themeId] }));
      },
      setMissionAnswer(attemptId, inputId, value) {
        set((state) => ({
          missionAttempts: state.missionAttempts.map((attempt) => attempt.id === attemptId ? { ...attempt, answers: { ...attempt.answers, [inputId]: value } } : attempt)
        }));
      },
      saveFocusObject(focusObject) {
        set((state) => ({
          focusObjects: state.focusObjects.some((item) => item.id === focusObject.id)
            ? state.focusObjects.map((item) => item.id === focusObject.id ? { ...focusObject, updatedAt: Date.now() } : item)
            : [...state.focusObjects, focusObject]
        }));
      },
      startMission(missionId) {
        const mission = get().dailyMissions.find((item) => item.id === missionId);
        if (mission) get().startTechnologyMission(mission.technologyId);
      },
      completeMission(missionId) {
        const mission = get().dailyMissions.find((item) => item.id === missionId);
        if (mission) get().completeTechnologyMission(mission.technologyId);
      },
      startTechnologyMission(technologyId) {
        const tech = technologies.find((item) => item.id === technologyId);
        if (!tech) return;

        const state = get();
        const completed = state.completedTechnologyIds;
        const locked = getTechnologyLockReasons(tech, state).length > 0;
        const runtime = state.technologyRuntime[technologyId] ?? { progress: 0, status: "ready" };
        const now = Date.now();
        const hasAnotherActiveMission = Object.entries(state.technologyRuntime).some(([id, item]) => id !== technologyId && item.status === "active");
        if (!canStartMission({ locked, completed: completed.includes(technologyId), globalCooldownUntil: state.globalMissionCooldownUntil, runtime, hasAnotherActiveMission, now })) return;

        const startedAt = now;
        const definition = getMissionDefinition(tech);
        const attemptId = `${definition.id}:${startedAt}`;
        const focusObject = findReusableFocusObject(state.focusObjects, tech.category);
        set((state) => ({
          activeMissionAttemptId: attemptId,
          missionAttempts: [...state.missionAttempts, {
            id: attemptId,
            missionId: definition.id,
            technologyId,
            startedAt,
            answers: initialAnswersFromFocus(tech.category, focusObject),
            selectedFocusObject: focusObject?.id
          }],
          technologyRuntime: {
            ...state.technologyRuntime,
            [technologyId]: { ...runtime, status: "active", startedAt, completedAt: undefined }
          }
        }));
      },
      completeTechnologyMission(technologyId) {
        const tech = technologies.find((item) => item.id === technologyId);
        if (!tech) return;

        const stateBeforeCompletion = get();
        const mission = getTechnologyMission(tech);
        const definition = getMissionDefinition(tech);
        const runtime = stateBeforeCompletion.technologyRuntime[technologyId];
        if (!runtime || runtime.status !== "active" || !runtime.startedAt) return;

        const activeAttempt = stateBeforeCompletion.missionAttempts.find((attempt) => attempt.id === stateBeforeCompletion.activeMissionAttemptId && attempt.technologyId === technologyId);
        if (!activeAttempt || !canCompleteMissionAttempt(definition, activeAttempt, runtime, Date.now())) return;

        const now = Date.now();
        const elapsedSeconds = Math.floor((now - runtime.startedAt) / 1000);
        if (elapsedSeconds < mission.minDurationSeconds) return;

        const target = getTechnologyTarget(tech);
        const nextProgress = Math.min(target, runtime.progress + mission.progressGain);
        const completedTechnology = nextProgress >= target;
        const alreadyCompleted = stateBeforeCompletion.completedTechnologyIds.includes(technologyId);
        const missionXp = completedTechnology ? tech.xpReward : Math.max(5, Math.round(tech.xpReward / target));
        const globalCooldownUntil = now + getGlobalCooldownSeconds(mission.globalCooldownType) * 1000;
        const categoryReward = tech.rewards.researchPoints?.[tech.category] ?? 0;
        const researchGain = completedTechnology ? categoryReward : Math.max(1, Math.round(categoryReward / target));
        const completionInsight = completedTechnology && !alreadyCompleted ? tech.rewards.insightPoints ?? 0 : 0;
        const existingFocusObject = findReusableFocusObject(stateBeforeCompletion.focusObjects, tech.category);
        const newFocusObject = tech.parents.length === 0 && !existingFocusObject ? focusObjectFromAttempt(tech.category, activeAttempt.answers, now) : undefined;

        set((state) => ({
          totalXp: state.totalXp + missionXp,
          researchPoints: addResearchPoints(state.researchPoints, { [tech.category]: researchGain }),
          insightPoints: state.insightPoints + completionInsight,
          unlockedTreeThemeIds: completedTechnology && tech.rewards.themeUnlock && !state.unlockedTreeThemeIds.includes(tech.rewards.themeUnlock) ? [...state.unlockedTreeThemeIds, tech.rewards.themeUnlock] : state.unlockedTreeThemeIds,
          themeFragments: completedTechnology && tech.rewards.themeFragment ? { ...state.themeFragments, [tech.rewards.themeFragment]: (state.themeFragments[tech.rewards.themeFragment] ?? 0) + 1 } : state.themeFragments,
          earnedBadges: completedTechnology ? addUnique(state.earnedBadges, tech.rewards.badge) : state.earnedBadges,
          earnedTitles: completedTechnology ? addUnique(state.earnedTitles, tech.rewards.title) : state.earnedTitles,
          unlockedNodeFrames: completedTechnology ? addUnique(state.unlockedNodeFrames, tech.rewards.nodeFrame) : state.unlockedNodeFrames,
          unlockedBackgroundEffects: completedTechnology ? addUnique(state.unlockedBackgroundEffects, tech.rewards.backgroundEffect) : state.unlockedBackgroundEffects,
          globalMissionCooldownUntil: globalCooldownUntil,
          activeMissionAttemptId: undefined,
          focusObjects: newFocusObject ? [...state.focusObjects.filter((item) => item.category !== tech.category), newFocusObject] : state.focusObjects,
          missionAttempts: state.missionAttempts.map((attempt) => attempt.id === activeAttempt.id ? {
            ...attempt,
            completedAt: now,
            elapsedSeconds,
            selectedFocusObject: newFocusObject?.id ?? attempt.selectedFocusObject,
            evidence: { summary: answerText(activeAttempt.answers.result) || definition.concreteOutcome, confirmedAt: now } satisfies MissionCompletionEvidence,
            earnedRewards: { xp: missionXp, researchPoints: { [tech.category]: researchGain }, insightPoints: completionInsight }
          } : attempt),
          completedTechnologyIds: completedTechnology && !alreadyCompleted ? [...state.completedTechnologyIds, technologyId] : state.completedTechnologyIds,
          technologyRuntime: {
            ...state.technologyRuntime,
            [technologyId]: {
              ...runtime,
              progress: nextProgress,
              status: completedTechnology ? "completed" : "cooldown",
              completedAt: now,
              cooldownUntil: completedTechnology ? undefined : now + (mission.personalCooldownSeconds ?? mission.cooldownSeconds) * 1000
            }
          }
        }));
      },
      unlockTechnology(technologyId) {
        get().startTechnologyMission(technologyId);
      },
      updatePlannerBlock(hour, plan, technologyId) {
        set((state) => ({
          planner: state.planner.map((block) => (block.hour === hour ? { ...block, plan, technologyId } : block))
        }));
      },
      togglePlannerBlock(hour) {
        const block = get().planner.find((item) => item.hour === hour);
        if (!block || !block.plan.trim()) return;
        set((state) => ({
          planner: state.planner.map((item) => (item.hour === hour ? { ...item, completed: !item.completed } : item))
        }));
      }
    }),
    {
      name: "habidoo-life-strategy-v1",
      merge: (persisted, current) => ({
        ...current,
        ...normalizeState(persisted as Partial<PlayerState> | undefined)
      })
    }
  )
);
