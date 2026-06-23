import type { Achievement, InventoryItem, PlayerState } from "./types";

const branchRootIds = ["health-root", "mind-root", "finance-root", "business-root", "career-root", "relationships-root", "creativity-root"];

function unique(values: (string | undefined)[]) {
  return Array.from(new Set(values.filter(Boolean) as string[]));
}

export const inventoryCatalog: InventoryItem[] = [
  { id: "beta_tester_badge", type: "badge", rarity: "beta", title: "Beta Tester", description: "Joined Habidoo while the Foundation shell was still being forged." },
  { id: "beta_tester_frame", type: "profileFrame", rarity: "beta", title: "Founder's Signal", description: "A restrained profile frame for early closed-beta accounts." },
  { id: "first_mission_badge", type: "badge", rarity: "common", title: "First Proof", description: "Completed the first real Habidoo mission." },
  { id: "focus_seed_badge", type: "badge", rarity: "common", title: "Focus Seed", description: "Created the first Focus Object for a chapter." },
  { id: "root_awakener_badge", type: "badge", rarity: "rare", title: "Root Awakened", description: "Completed a first branch root in the Life Tree." },
  { id: "steady_three_badge", type: "badge", rarity: "rare", title: "Three Real Steps", description: "Completed three evidence-based missions." },
  { id: "foundation_pathfinder_frame", type: "profileFrame", rarity: "epic", title: "Foundation Pathfinder", description: "Completed four branch roots in the Foundation Era." },
  { id: "awakening_title", type: "title", rarity: "trial", title: "Awakened Strategist", description: "Completed The Awakening Trial." }
];

export const achievementCatalog: Achievement[] = [
  { id: "first_mission_completed", title: "First Mission Complete", description: "Complete any real mission.", type: "mission", rarity: "common", hiddenReward: false, rewardItemIds: ["first_mission_badge"], unlocked: false },
  { id: "first_focus_object_created", title: "First Focus Object", description: "Create your first Focus Object.", type: "foundation", rarity: "common", hiddenReward: false, rewardItemIds: ["focus_seed_badge"], unlocked: false },
  { id: "first_branch_root_completed", title: "Root Awakened", description: "Complete any branch root mission.", type: "foundation", rarity: "rare", hiddenReward: true, rewardItemIds: ["root_awakener_badge"], unlocked: false },
  { id: "three_missions_completed", title: "Three Real Steps", description: "Complete three evidence-based missions.", type: "mission", rarity: "rare", hiddenReward: false, rewardItemIds: ["steady_three_badge"], unlocked: false },
  { id: "four_branch_roots_completed", title: "Foundation Pathfinder", description: "Complete four branch roots.", type: "foundation", rarity: "epic", hiddenReward: true, rewardItemIds: ["foundation_pathfinder_frame"], unlocked: false },
  { id: "awakening_trial_completed", title: "The Awakening Trial", description: "Complete the Foundation chapter trial.", type: "trial", rarity: "trial", hiddenReward: true, rewardItemIds: ["awakening_title"], unlocked: false },
  { id: "beta_tester_account", title: "Closed Beta Founder", description: "Create a confirmed Habidoo account during closed beta.", type: "account", rarity: "beta", hiddenReward: false, rewardItemIds: ["beta_tester_badge", "beta_tester_frame"], unlocked: false }
];

export function getInventoryItem(itemId: string) {
  return inventoryCatalog.find((item) => item.id === itemId);
}

export function createAchievementState(persisted?: Achievement[]) {
  const persistedById = new Map((persisted ?? []).map((achievement) => [achievement.id, achievement]));
  return achievementCatalog.map((achievement) => {
    const saved = persistedById.get(achievement.id);
    return {
      ...achievement,
      unlocked: saved?.unlocked === true,
      unlockedAt: saved?.unlockedAt
    };
  });
}

export function evaluateAchievementCondition(achievementId: string, state: Pick<PlayerState, "missionAttempts" | "focusObjects" | "completedTechnologyIds" | "betaTesterRewardGranted">) {
  const completedMissionCount = state.missionAttempts.filter((attempt) => attempt.completedAt).length;
  const completedRootCount = branchRootIds.filter((id) => state.completedTechnologyIds.includes(id)).length;
  if (achievementId === "first_mission_completed") return completedMissionCount >= 1;
  if (achievementId === "first_focus_object_created") return state.focusObjects.length >= 1;
  if (achievementId === "first_branch_root_completed") return completedRootCount >= 1;
  if (achievementId === "three_missions_completed") return completedMissionCount >= 3;
  if (achievementId === "four_branch_roots_completed") return completedRootCount >= 4;
  if (achievementId === "awakening_trial_completed") return state.completedTechnologyIds.includes("awakening-trial");
  if (achievementId === "beta_tester_account") return state.betaTesterRewardGranted === true;
  return false;
}

export function evaluateGameProgression(state: PlayerState, now = Date.now()) {
  const currentAchievements = createAchievementState(state.achievements);
  const previousUnlockedAchievementIds = currentAchievements.filter((achievement) => achievement.unlocked).map((achievement) => achievement.id);
  const achievements = currentAchievements.map((achievement) => {
    if (achievement.unlocked) return achievement;
    if (!evaluateAchievementCondition(achievement.id, state)) return achievement;
    return { ...achievement, unlocked: true, unlockedAt: now };
  });
  const unlockedAchievementIds = achievements.filter((achievement) => achievement.unlocked).map((achievement) => achievement.id);
  const newlyUnlockedAchievementIds = unlockedAchievementIds.filter((id) => !previousUnlockedAchievementIds.includes(id));
  const rewardItemIds = achievements.flatMap((achievement) => achievement.unlocked ? achievement.rewardItemIds ?? [] : []);
  const unlockedInventoryItemIds = unique([...(state.unlockedInventoryItemIds ?? []), ...rewardItemIds]);
  const newlyUnlockedInventoryItemIds = unlockedInventoryItemIds.filter((id) => !(state.unlockedInventoryItemIds ?? []).includes(id));
  const unlockedItems = unlockedInventoryItemIds.map(getInventoryItem).filter(Boolean) as InventoryItem[];
  const earnedBadges = unique([...state.earnedBadges, ...unlockedItems.filter((item) => item.type === "badge").map((item) => item.id)]);
  const earnedTitles = unique([...state.earnedTitles, ...unlockedItems.filter((item) => item.type === "title").map((item) => item.id)]);
  const unlockedNodeFrames = unique([...state.unlockedNodeFrames, ...unlockedItems.filter((item) => item.type === "profileFrame").map((item) => item.id)]);

  return {
    achievements,
    unlockedInventoryItemIds,
    newlyUnlockedAchievementIds,
    newlyUnlockedInventoryItemIds,
    earnedBadges,
    earnedTitles,
    unlockedNodeFrames,
    equippedBadgeId: state.equippedBadgeId && unlockedInventoryItemIds.includes(state.equippedBadgeId) ? state.equippedBadgeId : unlockedItems.find((item) => item.type === "badge")?.id,
    equippedFrameId: state.equippedFrameId && unlockedInventoryItemIds.includes(state.equippedFrameId) ? state.equippedFrameId : unlockedItems.find((item) => item.type === "profileFrame")?.id,
    equippedTitleId: state.equippedTitleId && unlockedInventoryItemIds.includes(state.equippedTitleId) ? state.equippedTitleId : unlockedItems.find((item) => item.type === "title")?.id
  };
}
