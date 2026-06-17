import { PlayerState } from "./types";

export function levelFromXp(totalXp: number) {
  const thresholds = [0, 100, 250, 500, 900, 1400, 2100, 3000, 4200, 5800];
  let level = 1;

  for (let index = 1; index < thresholds.length; index += 1) {
    if (totalXp >= thresholds[index]) level = index + 1;
  }

  const currentThreshold = thresholds[level - 1] ?? 0;
  const nextThreshold = thresholds[level] ?? currentThreshold + level * 900;
  const progress = Math.round(((totalXp - currentThreshold) / (nextThreshold - currentThreshold)) * 100);

  return {
    level,
    current: totalXp - currentThreshold,
    needed: nextThreshold - currentThreshold,
    progress: Math.min(100, Math.max(0, progress))
  };
}

export function dailyCompletionPercent(state: PlayerState) {
  const missionCount = state.dailyMissions.length;
  if (missionCount === 0) return 0;
  const done = state.dailyMissions.filter((mission) => mission.completed).length;
  return Math.round((done / missionCount) * 100);
}

export function lifeScore(state: PlayerState) {
  return state.completedTechnologyIds.length * 100 + state.totalXp + state.streak * 12;
}
