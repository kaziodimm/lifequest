export type LifeCategory = "health" | "mind" | "career" | "business" | "finance" | "relationships" | "creativity";

export type LifeEra = "foundation" | "discipline" | "growth" | "mastery" | "leadership" | "legacy";

export type TechStatus = "locked" | "available" | "in_progress" | "unlocked";

export type MissionStatus = "ready" | "active" | "cooldown" | "completed";

export type Locale = "en" | "cs" | "ru" | "uk";

export type VisualThemeId = "focus-dark" | "soft-light" | "pixel-quest" | "cyber-calm" | "nature-progress";

export type Requirement = {
  label: string;
  current: number;
  target: number;
};

export type TechnologyMission = {
  action: string;
  durationLabel: string;
  minDurationSeconds: number;
  cooldownSeconds: number;
  progressGain: number;
};

export type TechnologyRuntime = {
  progress: number;
  status: MissionStatus;
  startedAt?: number;
  completedAt?: number;
  cooldownUntil?: number;
};

export type LifeTechnology = {
  id: string;
  category: LifeCategory;
  era?: LifeEra;
  title: string;
  description: string;
  xpReward: number;
  requirements: Requirement[];
  mission?: TechnologyMission;
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
  status: MissionStatus;
  xpReward: number;
  minDurationSeconds: number;
  startedAt?: number;
  completedAt?: number;
  cooldownUntil?: number;
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
  currentEra: LifeEra;
  totalXp: number;
  streak: number;
  completedTechnologyIds: string[];
  technologyRuntime: Record<string, TechnologyRuntime>;
  dailyMissions: DailyMission[];
  planner: PlannerBlock[];
  achievements: Achievement[];
  progressHistory: number[];
};
