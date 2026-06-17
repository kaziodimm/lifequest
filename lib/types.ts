export type LifeCategory = "health" | "mind" | "career" | "business" | "finance" | "relationships" | "creativity";

export type TechStatus = "locked" | "available" | "in_progress" | "unlocked";

export type Locale = "en" | "cs" | "ru" | "uk";

export type VisualThemeId = "focus-dark" | "soft-light" | "pixel-quest" | "cyber-calm" | "nature-progress";

export type Requirement = {
  label: string;
  current: number;
  target: number;
};

export type LifeTechnology = {
  id: string;
  category: LifeCategory;
  title: string;
  description: string;
  xpReward: number;
  requirements: Requirement[];
  unlocks: string[];
  parents: string[];
  x: number;
  y: number;
};

export type DailyMission = {
  id: string;
  title: string;
  tinyStep: string;
  technologyId: string;
  important: boolean;
  completed: boolean;
  xpReward: number;
};

export type PlannerBlock = {
  hour: number;
  plan: string;
  technologyId?: string;
  completed: boolean;
};

export type Achievement = {
  id: string;
  title: string;
  description: string;
  unlocked: boolean;
};

export type PlayerState = {
  avatarName: string;
  locale: Locale;
  theme: VisualThemeId;
  totalXp: number;
  streak: number;
  completedTechnologyIds: string[];
  dailyMissions: DailyMission[];
  planner: PlannerBlock[];
  achievements: Achievement[];
  progressHistory: number[];
};
