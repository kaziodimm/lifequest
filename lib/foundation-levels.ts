export const maxFoundationLevel = 100;

export function getFoundationLevelXpThreshold(level: number) {
  const safeLevel = Math.min(maxFoundationLevel, Math.max(1, Math.floor(level)));
  const n = safeLevel - 1;
  return Math.round(55 * n + 12 * n * n + 0.42 * n * n * n);
}

export function getEraLevelFromXp(totalXp: number) {
  const safeXp = Math.max(0, Math.floor(totalXp));
  let level = 1;
  for (let candidate = 2; candidate <= maxFoundationLevel; candidate += 1) {
    if (safeXp >= getFoundationLevelXpThreshold(candidate)) level = candidate;
    else break;
  }
  return level;
}

export function getNextLevelXp(totalXp: number) {
  const level = getEraLevelFromXp(totalXp);
  if (level >= maxFoundationLevel) return getFoundationLevelXpThreshold(maxFoundationLevel);
  return getFoundationLevelXpThreshold(level + 1);
}

export function getLevelProgress(totalXp: number) {
  const level = getEraLevelFromXp(totalXp);
  const currentThreshold = getFoundationLevelXpThreshold(level);
  const nextThreshold = getNextLevelXp(totalXp);
  const needed = Math.max(1, nextThreshold - currentThreshold);
  const current = Math.max(0, Math.floor(totalXp) - currentThreshold);
  const progress = level >= maxFoundationLevel ? 100 : Math.round((current / needed) * 100);
  return {
    level,
    current,
    needed,
    nextLevelXp: nextThreshold,
    progress: Math.min(100, Math.max(0, progress))
  };
}
