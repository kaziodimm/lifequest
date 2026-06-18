"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { technologies } from "./life-tree";
import { getTechnologyMission, getTechnologyTarget } from "./missions";
import { DailyMission, Locale, PlayerState, TechnologyRuntime, VisualThemeId } from "./types";

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
    minDurationSeconds: 600
  },
  {
    id: "mission-build",
    title: "Work on one project asset",
    tinyStep: "Open the project file",
    technologyId: "first-project",
    important: true,
    completed: false,
    status: "ready",
    xpReward: 30,
    minDurationSeconds: 900
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
    minDurationSeconds: 60
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
const initialCompletedTechnologyIds = ["health-root", "morning-walk", "business-root", "first-project", "finance-root"];

const initialState: PlayerState = {
  avatarName: "Strategist",
  locale: "en",
  theme: "focus-dark",
  currentEra: "foundation",
  totalXp: 80,
  streak: 3,
  completedTechnologyIds: initialCompletedTechnologyIds,
  technologyRuntime: createInitialTechnologyRuntime(initialCompletedTechnologyIds),
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
  const completedIds = !savedCompletedIds || isLegacyDemo ? initialState.completedTechnologyIds : savedCompletedIds;
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
  const missions = (persisted?.dailyMissions ?? initialState.dailyMissions).map((mission) => normalizeMission(mission));
  const savedCompletedIds = persisted?.completedTechnologyIds;
  const isLegacyDemo = savedCompletedIds?.length === legacyCompletedTechnologyIds.length && legacyCompletedTechnologyIds.every((id) => savedCompletedIds.includes(id));

  return {
    ...initialState,
    ...persisted,
    completedTechnologyIds: !savedCompletedIds || isLegacyDemo ? initialState.completedTechnologyIds : savedCompletedIds,
    currentEra: persisted?.currentEra ?? initialState.currentEra,
    technologyRuntime: normalizeTechnologyRuntime(persisted),
    dailyMissions: missions,
    planner: persisted?.planner ?? initialState.planner,
    achievements: persisted?.achievements ?? initialState.achievements,
    progressHistory: persisted?.progressHistory ?? initialState.progressHistory
  };
}

type LifeStore = PlayerState & {
  setLocale: (locale: Locale) => void;
  setTheme: (theme: VisualThemeId) => void;
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
      startMission(missionId) {
        const mission = get().dailyMissions.find((item) => item.id === missionId);
        if (!mission || mission.completed || mission.status === "active") return;
        if (mission.status === "cooldown" && mission.cooldownUntil && mission.cooldownUntil > Date.now()) return;

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

        set((state) => ({
          totalXp: state.totalXp + mission.xpReward,
          dailyMissions: state.dailyMissions.map((item) =>
            item.id === missionId
              ? { ...item, completed: true, status: "completed", completedAt: now, cooldownUntil: now + 24 * 60 * 60 * 1000 }
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

        const completed = get().completedTechnologyIds;
        const canStart = tech.parents.every((parentId) => completed.includes(parentId));
        const runtime = get().technologyRuntime[technologyId] ?? { progress: 0, status: "ready" };
        if (!canStart || completed.includes(technologyId) || runtime.status === "active") return;
        if (runtime.cooldownUntil && runtime.cooldownUntil > Date.now()) return;

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

        set((state) => ({
          totalXp: state.totalXp + missionXp,
          completedTechnologyIds: completedTechnology && !alreadyCompleted ? [...state.completedTechnologyIds, technologyId] : state.completedTechnologyIds,
          technologyRuntime: {
            ...state.technologyRuntime,
            [technologyId]: {
              ...runtime,
              progress: nextProgress,
              status: completedTechnology ? "completed" : "cooldown",
              completedAt: now,
              cooldownUntil: completedTechnology ? undefined : now + mission.cooldownSeconds * 1000
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
