"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { technologies } from "./life-tree";
import { DailyMission, Locale, PlayerState, VisualThemeId } from "./types";

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

const initialState: PlayerState = {
  avatarName: "Strategist",
  locale: "en",
  theme: "focus-dark",
  currentEra: "foundation",
  totalXp: 80,
  streak: 3,
  completedTechnologyIds: ["health-root", "business-root"],
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

function normalizeState(persisted: Partial<PlayerState> | undefined): PlayerState {
  const missions = (persisted?.dailyMissions ?? initialState.dailyMissions).map((mission) => normalizeMission(mission));

  return {
    ...initialState,
    ...persisted,
    currentEra: persisted?.currentEra ?? initialState.currentEra,
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
      unlockTechnology(technologyId) {
        const tech = technologies.find((item) => item.id === technologyId);
        if (!tech) return;
        const completed = get().completedTechnologyIds;
        const canUnlock = tech.parents.every((parentId) => completed.includes(parentId));
        if (!canUnlock || completed.includes(technologyId)) return;

        set((state) => ({
          totalXp: state.totalXp + tech.xpReward,
          completedTechnologyIds: [...state.completedTechnologyIds, technologyId]
        }));
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
      merge: (persisted) => normalizeState(persisted as Partial<PlayerState> | undefined)
    }
  )
);
