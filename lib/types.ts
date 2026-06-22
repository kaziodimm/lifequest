export type LifeCategory = "health" | "mind" | "career" | "business" | "finance" | "relationships" | "creativity";

export type LifeEra = "foundation" | "discipline" | "growth" | "mastery" | "leadership" | "legacy";

export type TechStatus = "locked" | "available" | "in_progress" | "unlocked";

export type MissionStatus = "ready" | "active" | "cooldown" | "completed";
export type TechnologyNodeType = "technology" | "milestone" | "challenge";
export type GlobalCooldownType = "micro" | "standard" | "deep";
export type MissionDepth = GlobalCooldownType | "trial";
export type MissionInputType = "singleChoice" | "multiChoice" | "shortText" | "number" | "rating" | "checklist" | "dateOrTime" | "link" | "confirmation";
export type FocusObjectType = "project" | "careerSkill" | "financialGoal" | "relationship" | "creativeMedium" | "learningTopic" | "healthRoutine";

export type Locale = "en" | "ru" | "cs" | "uk";

export type VisualThemeId = "animus-dark" | "mirage-atlas" | "arcade-codex" | "neon-synapse" | "verdant-relic";

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

export type MissionChoice = {
  id: string;
  label: string;
  description?: string;
};

export type MissionInput = {
  id: string;
  type: MissionInputType;
  label: string;
  helpText?: string;
  placeholder?: string;
  example?: string;
  required: boolean;
  choices?: MissionChoice[];
  allowCustomChoice?: boolean;
  min?: number;
  max?: number;
};

export type MissionStep = {
  id: string;
  instruction: string;
  optional?: boolean;
};

export type UserFocusObject = {
  id: string;
  type: FocusObjectType;
  category: LifeCategory;
  name: string;
  desiredOutcome: string;
  createdAt: number;
  updatedAt?: number;
};

export type MissionCompletionEvidence = {
  summary: string;
  note?: string;
  link?: string;
  confirmedAt: number;
};

export type MissionAnswer = string | number | boolean | string[];

export type MissionAttempt = {
  id: string;
  missionId: string;
  technologyId: string;
  startedAt: number;
  completedAt?: number;
  elapsedSeconds?: number;
  answers: Record<string, MissionAnswer>;
  selectedFocusObject?: string;
  evidence?: MissionCompletionEvidence;
  earnedRewards?: ProgressionReward;
};

export type MissionDefinition = {
  id: string;
  technologyId: string;
  actionTitle: string;
  concreteOutcome: string;
  whyItMatters: string;
  duration: { minMinutes: number; maxMinutes: number; label: string };
  minimumDurationSeconds: number;
  cooldown: { personalSeconds: number; globalType: GlobalCooldownType };
  exactSteps: MissionStep[];
  completionCriteria: string;
  inputSchema: MissionInput[];
  recommendedChoice?: string;
  optionalChoices?: MissionChoice[];
  exampleResult?: string;
  whatCounts?: string;
  whatDoesNotCount?: string;
  rewards: ProgressionReward;
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
  onboardingCompleted: boolean;
  primaryCategory?: LifeCategory;
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
  activeMissionAttemptId?: string;
  missionAttempts: MissionAttempt[];
  focusObjects: UserFocusObject[];
  dailyMissions: DailyMission[];
  planner: PlannerBlock[];
  achievements: Achievement[];
  progressHistory: number[];
};
