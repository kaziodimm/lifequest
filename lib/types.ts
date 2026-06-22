export type LifeCategory = "health" | "mind" | "career" | "business" | "finance" | "relationships" | "creativity";

export type LifeEra = "foundation" | "discipline" | "growth" | "mastery" | "leadership" | "legacy";

export type TechStatus = "locked" | "available" | "in_progress" | "unlocked";

export type MissionStatus = "ready" | "active" | "cooldown" | "completed";
export type TechnologyNodeType = "technology" | "milestone" | "challenge";
export type GlobalCooldownType = "micro" | "standard" | "deep";
export type MissionDepth = GlobalCooldownType | "trial";

export type Locale = "en" | "ru";

export type VisualThemeId = "focus-dark" | "soft-light" | "pixel-quest" | "cyber-calm" | "nature-progress";

export type Requirement = {
  label: string;
  current: number;
  target: number;
};

export type ResearchPointBalances = Record<LifeCategory, number>;

export type ProgressionReward = {
  xp: number;
  researchPoints?: Partial<ResearchPointBalances>;
  insightPoints?: number;
  badge?: string;
  title?: string;
  themeUnlock?: string;
  themeFragment?: string;
  nodeFrame?: string;
  backgroundEffect?: string;
};

export type TechnologyMission = {
  action: string;
  actionTitle?: string;
  actionDescription?: string;
  exactSteps?: string[];
  successCriteria?: string;
  durationMinMinutes?: number;
  durationMaxMinutes?: number;
  durationLabel: string;
  minDurationSeconds: number;
  cooldownSeconds: number;
  personalCooldownSeconds?: number;
  globalCooldownType?: GlobalCooldownType;
  oneTime?: boolean;
  progressGain: number;
  whatCounts?: string;
  whatDoesNotCount?: string;
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
  chapter?: number;
  branch?: string;
  type?: TechnologyNodeType;
  era?: LifeEra;
  title: string;
  shortTitle?: string;
  description: string;
  icon?: string;
  xpReward: number;
  rewards: ProgressionReward;
  requiredLevel?: number;
  requiredInsightPoints?: number;
  requiredCategoryProgress?: Partial<Record<LifeCategory, number>>;
  requiredCompletedBranches?: number;
  requirements: Requirement[];
  mission?: TechnologyMission;
  unlocks: string[];
  parents: string[];
  requiredParentCount?: number;
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
  globalCooldownType?: GlobalCooldownType;
  personalCooldownSeconds?: number;
  rewards?: ProgressionReward;
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
  researchPoints: ResearchPointBalances;
  insightPoints: number;
  unlockedTreeThemeIds: string[];
  themeFragments: Record<string, number>;
  earnedBadges: string[];
  earnedTitles: string[];
  unlockedNodeFrames: string[];
  unlockedBackgroundEffects: string[];
  streak: number;
  completedTechnologyIds: string[];
  technologyRuntime: Record<string, TechnologyRuntime>;
  globalMissionCooldownUntil?: number;
  dailyMissions: DailyMission[];
  planner: PlannerBlock[];
  achievements: Achievement[];
  progressHistory: number[];
};
