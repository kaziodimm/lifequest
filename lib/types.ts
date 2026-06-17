export type LifeCategory = "health" | "mind" | "career" | "business" | "finance" | "relationships" | "creativity";

export type TechStatus = "locked" | "available" | "in_progress" | "unlocked";

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
  totalXp: number;
  streak: number;
  completedTechnologyIds: string[];
  dailyMissions: DailyMission[];
  planner: PlannerBlock[];
  achievements: Achievement[];
  progressHistory: number[];
};
