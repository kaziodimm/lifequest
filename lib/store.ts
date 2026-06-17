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
    xpReward: 20
  },
  {
    id: "mission-build",
    title: "Work on one project asset",
    tinyStep: "Open the project file",
    technologyId: "first-project",
    important: true,
    completed: false,
    xpReward: 30
  },
  {
    id: "mission-water",
    title: "Drink water before coffee",
    tinyStep: "Fill one glass",
    technologyId: "hydration",
    important: false,
    completed: false,
    xpReward: 10
  }
];

const initialState: PlayerState = {
  avatarName: "Strategist",
  locale: "en",
  theme: "focus-dark",
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

type LifeStore = PlayerState & {
  setLocale: (locale: Locale) => void;
  setTheme: (theme: VisualThemeId) => void;
  completeMission: (missionId: string) => void;
  unlockTechnology: (technologyId: string) => void;
  updatePlannerBlock: (hour: number, plan: string, technologyId?: string) => void;
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
      completeMission(missionId) {
        const mission = get().dailyMissions.find((item) => item.id === missionId);
        if (!mission || mission.completed) return;

        set((state) => ({
          totalXp: state.totalXp + mission.xpReward,
          dailyMissions: state.dailyMissions.map((item) => (item.id === missionId ? { ...item, completed: true } : item)),
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
      }
    }),
    {
      name: "habidoo-life-strategy-v1",
      merge: (persisted, current) => ({ ...current, ...(persisted as Partial<PlayerState>) })
    }
  )
);
