import type { LifeCategory, LifeTechnology, TechnologyMission } from "./types";

const categoryMissionDefaults: Record<LifeCategory, TechnologyMission> = {
  health: {
    action: "Complete a real movement session connected to this upgrade.",
    durationLabel: "10-30 minutes",
    minDurationSeconds: 600,
    cooldownSeconds: 12 * 60 * 60,
    progressGain: 1
  },
  mind: {
    action: "Do one focused learning or reflection session.",
    durationLabel: "20-45 minutes",
    minDurationSeconds: 20 * 60,
    cooldownSeconds: 2 * 60 * 60,
    progressGain: 1
  },
  career: {
    action: "Create one visible proof item for your professional path.",
    durationLabel: "30-60 minutes",
    minDurationSeconds: 30 * 60,
    cooldownSeconds: 4 * 60 * 60,
    progressGain: 1
  },
  business: {
    action: "Build or ship one small asset that moves the project forward.",
    durationLabel: "30-60 minutes",
    minDurationSeconds: 30 * 60,
    cooldownSeconds: 4 * 60 * 60,
    progressGain: 1
  },
  finance: {
    action: "Do one concrete money-management action.",
    durationLabel: "15-30 minutes",
    minDurationSeconds: 15 * 60,
    cooldownSeconds: 12 * 60 * 60,
    progressGain: 1
  },
  relationships: {
    action: "Make one intentional connection or follow-up.",
    durationLabel: "10-20 minutes",
    minDurationSeconds: 10 * 60,
    cooldownSeconds: 12 * 60 * 60,
    progressGain: 1
  },
  creativity: {
    action: "Produce or finish one small creative artifact.",
    durationLabel: "20-45 minutes",
    minDurationSeconds: 20 * 60,
    cooldownSeconds: 2 * 60 * 60,
    progressGain: 1
  }
};

const missionOverrides: Record<string, Partial<TechnologyMission>> = {
  "morning-walk": {
    action: "Go outside and walk with no setup ritual.",
    durationLabel: "10 minutes",
    minDurationSeconds: 10 * 60,
    cooldownSeconds: 12 * 60 * 60
  },
  hydration: {
    action: "Drink water before coffee or another stimulant.",
    durationLabel: "1 minute",
    minDurationSeconds: 60,
    cooldownSeconds: 8 * 60 * 60
  },
  "cardio-i": {
    action: "Complete a cardio workout.",
    durationLabel: "30-60 minutes",
    minDurationSeconds: 30 * 60,
    cooldownSeconds: 12 * 60 * 60
  },
  reader: {
    action: "Read with focus and no scrolling nearby.",
    durationLabel: "20-40 minutes",
    minDurationSeconds: 20 * 60,
    cooldownSeconds: 2 * 60 * 60
  },
  "deep-work": {
    action: "Do one protected deep work session.",
    durationLabel: "45-90 minutes",
    minDurationSeconds: 45 * 60,
    cooldownSeconds: 4 * 60 * 60
  }
};

export function getTechnologyMission(technology: LifeTechnology): TechnologyMission {
  return {
    ...categoryMissionDefaults[technology.category],
    ...technology.mission,
    ...missionOverrides[technology.id]
  };
}

export function getTechnologyTarget(technology: LifeTechnology) {
  return technology.requirements[0]?.target ?? 1;
}
