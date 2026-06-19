import type { LifeCategory, LifeTechnology, TechnologyMission } from "./types";

const categoryMissionDefaults: Record<LifeCategory, TechnologyMission> = {
  health: {
    action: "Complete a real movement session connected to this upgrade.",
    durationLabel: "10-30 minutes",
    minDurationSeconds: 600,
    cooldownSeconds: 12 * 60 * 60,
    progressGain: 1,
    globalCooldownType: "standard"
  },
  mind: {
    action: "Do one focused learning or reflection session.",
    durationLabel: "20-45 minutes",
    minDurationSeconds: 20 * 60,
    cooldownSeconds: 2 * 60 * 60,
    progressGain: 1,
    globalCooldownType: "standard"
  },
  career: {
    action: "Create one visible proof item for your professional path.",
    durationLabel: "30-60 minutes",
    minDurationSeconds: 30 * 60,
    cooldownSeconds: 4 * 60 * 60,
    progressGain: 1,
    globalCooldownType: "deep"
  },
  business: {
    action: "Build or ship one small asset that moves the project forward.",
    durationLabel: "30-60 minutes",
    minDurationSeconds: 30 * 60,
    cooldownSeconds: 4 * 60 * 60,
    progressGain: 1,
    globalCooldownType: "deep"
  },
  finance: {
    action: "Do one concrete money-management action.",
    durationLabel: "15-30 minutes",
    minDurationSeconds: 15 * 60,
    cooldownSeconds: 12 * 60 * 60,
    progressGain: 1,
    globalCooldownType: "standard"
  },
  relationships: {
    action: "Make one intentional connection or follow-up.",
    durationLabel: "10-20 minutes",
    minDurationSeconds: 10 * 60,
    cooldownSeconds: 12 * 60 * 60,
    progressGain: 1,
    globalCooldownType: "standard"
  },
  creativity: {
    action: "Produce or finish one small creative artifact.",
    durationLabel: "20-45 minutes",
    minDurationSeconds: 20 * 60,
    cooldownSeconds: 2 * 60 * 60,
    progressGain: 1,
    globalCooldownType: "standard"
  }
};

export function getTechnologyMission(technology: LifeTechnology): TechnologyMission {
  return {
    ...categoryMissionDefaults[technology.category],
    ...technology.mission
  };
}

export function getGlobalCooldownSeconds(type: TechnologyMission["globalCooldownType"]) {
  if (type === "micro") return 15 * 60;
  if (type === "deep") return 60 * 60;
  return 30 * 60;
}

export function getTechnologyTarget(technology: LifeTechnology) {
  return technology.requirements[0]?.target ?? 1;
}
