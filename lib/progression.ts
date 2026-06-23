import { technologies } from "./life-tree";
import { getLevelProgress } from "./foundation-levels";
import type { LifeCategory, LifeTechnology, PlayerState } from "./types";

export { getEraLevelFromXp, getFoundationLevelXpThreshold, getLevelProgress, getNextLevelXp, maxFoundationLevel } from "./foundation-levels";

export function levelFromXp(totalXp: number) {
  const progress = getLevelProgress(totalXp);
  return {
    level: progress.level,
    current: progress.current,
    needed: progress.needed,
    progress: progress.progress
  };
}

export function dailyCompletionPercent(state: PlayerState) {
  const dayStart = new Date();
  dayStart.setHours(0, 0, 0, 0);
  const completedToday = state.missionAttempts.filter((attempt) => attempt.completedAt && attempt.completedAt >= dayStart.getTime()).length;
  return Math.min(100, completedToday * 25);
}

export function lifeScore(state: PlayerState) {
  return state.completedTechnologyIds.length * 100 + state.totalXp + state.insightPoints * 50 + state.streak * 12;
}

export function completedCategoryProgress(completedIds: string[]) {
  const progress = Object.fromEntries(["health", "mind", "career", "business", "finance", "relationships", "creativity"].map((category) => [category, 0])) as Record<LifeCategory, number>;
  technologies.forEach((technology) => {
    if (completedIds.includes(technology.id)) progress[technology.category] += 1;
  });
  return progress;
}

export function completedBranchCount(completedIds: string[]) {
  return technologies.filter((technology) => technology.type === "milestone" && completedIds.includes(technology.id)).length;
}

export function getTechnologyLockReasons(technology: LifeTechnology, state: Pick<PlayerState, "completedTechnologyIds" | "totalXp" | "insightPoints">) {
  const reasons: string[] = [];
  const completedParents = technology.parents.filter((parentId) => state.completedTechnologyIds.includes(parentId)).length;
  const requiredParents = technology.requiredParentCount ?? technology.parents.length;
  if (completedParents < requiredParents) reasons.push(`Complete ${requiredParents - completedParents} more required parent ${requiredParents - completedParents === 1 ? "mission" : "missions"}.`);

  const level = levelFromXp(state.totalXp).level;
  if (technology.requiredLevel && level < technology.requiredLevel) reasons.push(`Reach level ${technology.requiredLevel}.`);
  if (technology.requiredInsightPoints && state.insightPoints < technology.requiredInsightPoints) reasons.push(`Earn ${technology.requiredInsightPoints - state.insightPoints} more Insight Points.`);

  const categoryProgress = completedCategoryProgress(state.completedTechnologyIds);
  Object.entries(technology.requiredCategoryProgress ?? {}).forEach(([category, required]) => {
    const current = categoryProgress[category as LifeCategory];
    if (required && current < required) reasons.push(`Complete ${required - current} more ${category} branch ${required - current === 1 ? "node" : "nodes"}.`);
  });

  const completedBranches = completedBranchCount(state.completedTechnologyIds);
  if (technology.requiredCompletedBranches && completedBranches < technology.requiredCompletedBranches) {
    reasons.push(`Complete ${technology.requiredCompletedBranches - completedBranches} more branch ${technology.requiredCompletedBranches - completedBranches === 1 ? "milestone" : "milestones"}.`);
  }
  return reasons;
}
