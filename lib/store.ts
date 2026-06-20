"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { technologies } from "./life-tree";
import { getGlobalCooldownSeconds, getTechnologyMission, getTechnologyTarget } from "./missions";
import { getTechnologyLockReasons } from "./progression";
import { DailyMission, LifeCategory, Locale, PlayerState, ProgressionReward, ResearchPointBalances, TechnologyRuntime, VisualThemeId } from "./types";

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
const initialCompletedTechnologyIds = ["health-root", "morning-walk", "business-root", "project-sprint", "finance-root"];

const initialState: PlayerState = {
  avatarName: "Strategist",
  locale: "en",
  theme: "focus-dark",
  currentEra: "foundation",
  totalXp: 80,
  researchPoints: { ...emptyResearchPoints },
  insightPoints: 0,
  unlockedTreeThemeIds: ["orbit"],
  themeFragments: {},
  earnedBadges: [],
  earnedTitles: [],
  unlockedNodeFrames: [],
  unlockedBackgroundEffects: [],
  streak: 3,
  completedTechnologyIds: initialCompletedTechnologyIds,
  technologyRuntime: createInitialTechnologyRuntime(initialCompletedTechnologyIds),
  globalMissionCooldownUntil: undefined,
  dailyMissions: initialMissions,
  planner: Array.from({ length: 24 }, (_, hour) => ({ hour, plan: "", completed: false })),
  achievements: [
    { id: "first-command", title: "First Command", description: "Complete the first daily mission.", unlocked: false },
    { id: "three-day-streak", title: "3 Day Chain", description: "Reach a 3 day streak.", unlocked: true }
  ],
  progressHistory: [12, 18, 22, 35, 41, 47, 53]
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
  let activeMissionClaimed = false;
  const missions = (persisted?.dailyMissions ?? initialState.dailyMissions).map((mission) => {
    const normalized = normalizeMission(mission);
    if (normalized.status !== "active") return normalized;
    if (activeMissionClaimed) return { ...normalized, status: "ready" as const, startedAt: undefined };
    activeMissionClaimed = true;
    return normalized;
  });
  const savedCompletedIds = persisted?.completedTechnologyIds;
  const isLegacyDemo = savedCompletedIds?.length === legacyCompletedTechnologyIds.length && legacyCompletedTechnologyIds.every((id) => savedCompletedIds.includes(id));
  const validIds = new Set(technologies.map((technology) => technology.id));
  const hasRemovedTechnology = savedCompletedIds?.some((id) => !validIds.has(id));

  const technologyRuntime = normalizeTechnologyRuntime(persisted);
  Object.keys(technologyRuntime).forEach((technologyId) => {
    if (technologyRuntime[technologyId].status !== "active") return;
    if (activeMissionClaimed) technologyRuntime[technologyId] = { ...technologyRuntime[technologyId], status: "ready", startedAt: undefined };
    else activeMissionClaimed = true;
  });

  return {
    ...initialState,
    ...persisted,
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
    technologyRuntime,
    dailyMissions: missions,
    planner: persisted?.planner ?? initialState.planner,
    achievements: persisted?.achievements ?? initialState.achievements,
    progressHistory: persisted?.progressHistory ?? initialState.progressHistory
  };
}

type LifeStore = PlayerState & {
  setLocale: (locale: Locale) => void;
  setTheme: (theme: VisualThemeId) => void;
  unlockTreeTheme: (themeId: string) => void;
  startMission: (missionId: string) => void;
  completeMission: (missionId: string) => void;
  startTechnologyMission: (technologyId: string) => void;
  completeTechnologyMission: (technologyId: string) => void;
  unlockTechnology: (technologyId: string) => void;
  updatePlannerBlock: (hour: number, plan: string, technologyId?: string) => void;
  togglePlannerBlock: (hour: number) => void;
};

export const useLifeStore = create<LifeStore>()(
  persist(
    (set, get) => ({
      ...initialState,
      setLocale(locale) {
        set({ locale });
      },
      setTheme(theme) {
        set({ theme });
      },
      unlockTreeTheme(themeId) {
        set((state) => ({ unlockedTreeThemeIds: state.unlockedTreeThemeIds.includes(themeId) ? state.unlockedTreeThemeIds : [...state.unlockedTreeThemeIds, themeId] }));
      },
      startMission(missionId) {
        const state = get();
        const mission = state.dailyMissions.find((item) => item.id === missionId);
        if (!mission || mission.completed || mission.status === "active") return;
        if (mission.status === "cooldown" && mission.cooldownUntil && mission.cooldownUntil > Date.now()) return;
        if (state.globalMissionCooldownUntil && state.globalMissionCooldownUntil > Date.now()) return;
        if (state.dailyMissions.some((item) => item.status === "active") || Object.values(state.technologyRuntime).some((item) => item.status === "active")) return;

        set((state) => ({
          dailyMissions: state.dailyMissions.map((item) =>
            item.id === missionId ? { ...item, status: "active", startedAt: Date.now(), completedAt: undefined } : item
          )
        }));
      },
      completeMission(missionId) {
        const mission = get().dailyMissions.find((item) => item.id === missionId);
        if (!mission || mission.completed || mission.status !== "active" || !mission.startedAt) return;

        const now = Date.now();
        const elapsedSeconds = Math.floor((now - mission.startedAt) / 1000);
        if (elapsedSeconds < mission.minDurationSeconds) return;

        const technology = technologies.find((item) => item.id === mission.technologyId);
        const reward: ProgressionReward = mission.rewards ?? {
          xp: mission.xpReward,
          researchPoints: technology ? { [technology.category]: 1 } : undefined
        };

        set((state) => ({
          totalXp: state.totalXp + reward.xp,
          researchPoints: addResearchPoints(state.researchPoints, reward.researchPoints),
          insightPoints: state.insightPoints + (reward.insightPoints ?? 0),
          unlockedTreeThemeIds: reward.themeUnlock && !state.unlockedTreeThemeIds.includes(reward.themeUnlock) ? [...state.unlockedTreeThemeIds, reward.themeUnlock] : state.unlockedTreeThemeIds,
          themeFragments: reward.themeFragment ? { ...state.themeFragments, [reward.themeFragment]: (state.themeFragments[reward.themeFragment] ?? 0) + 1 } : state.themeFragments,
          earnedBadges: addUnique(state.earnedBadges, reward.badge),
          earnedTitles: addUnique(state.earnedTitles, reward.title),
          unlockedNodeFrames: addUnique(state.unlockedNodeFrames, reward.nodeFrame),
          unlockedBackgroundEffects: addUnique(state.unlockedBackgroundEffects, reward.backgroundEffect),
          globalMissionCooldownUntil: now + getGlobalCooldownSeconds(mission.globalCooldownType) * 1000,
          dailyMissions: state.dailyMissions.map((item) =>
            item.id === missionId
              ? { ...item, completed: true, status: "completed", completedAt: now, cooldownUntil: now + (mission.personalCooldownSeconds ?? 24 * 60 * 60) * 1000 }
              : item
          ),
          achievements: state.achievements.map((achievement) =>
            achievement.id === "first-command" ? { ...achievement, unlocked: true } : achievement
          )
        }));
      },
      startTechnologyMission(technologyId) {
        const tech = technologies.find((item) => item.id === technologyId);
        if (!tech) return;

        const state = get();
        const completed = state.completedTechnologyIds;
        const canStart = getTechnologyLockReasons(tech, state).length === 0;
        const runtime = state.technologyRuntime[technologyId] ?? { progress: 0, status: "ready" };
        if (!canStart || completed.includes(technologyId) || runtime.status === "active") return;
        if (runtime.cooldownUntil && runtime.cooldownUntil > Date.now()) return;
        if (state.globalMissionCooldownUntil && state.globalMissionCooldownUntil > Date.now()) return;
        if (state.dailyMissions.some((item) => item.status === "active") || Object.values(state.technologyRuntime).some((item) => item.status === "active")) return;

        set((state) => ({
          technologyRuntime: {
            ...state.technologyRuntime,
            [technologyId]: { ...runtime, status: "active", startedAt: Date.now(), completedAt: undefined }
          }
        }));
      },
      completeTechnologyMission(technologyId) {
        const tech = technologies.find((item) => item.id === technologyId);
        if (!tech) return;

        const mission = getTechnologyMission(tech);
        const runtime = get().technologyRuntime[technologyId];
        if (!runtime || runtime.status !== "active" || !runtime.startedAt) return;

        const now = Date.now();
        const elapsedSeconds = Math.floor((now - runtime.startedAt) / 1000);
        if (elapsedSeconds < mission.minDurationSeconds) return;

        const target = getTechnologyTarget(tech);
        const nextProgress = Math.min(target, runtime.progress + mission.progressGain);
        const completedTechnology = nextProgress >= target;
        const alreadyCompleted = get().completedTechnologyIds.includes(technologyId);
        const missionXp = completedTechnology ? tech.xpReward : Math.max(5, Math.round(tech.xpReward / target));
        const globalCooldownUntil = now + getGlobalCooldownSeconds(mission.globalCooldownType) * 1000;
        const categoryReward = tech.rewards.researchPoints?.[tech.category] ?? 0;
        const researchGain = completedTechnology ? categoryReward : Math.max(1, Math.round(categoryReward / target));
        const completionInsight = completedTechnology && !alreadyCompleted ? tech.rewards.insightPoints ?? 0 : 0;

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
          totalXp: block.completed ? Math.max(0, state.totalXp - 5) : state.totalXp + 5,
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
