import type { LifeCategory, LifeTechnology, MissionDefinition, MissionInput, TechnologyMission } from "./types";

const guidedRootMissions: Record<string, Partial<MissionDefinition>> = {
  "health-root": {
    actionTitle: "Check your energy now",
    concreteOutcome: "Save one clear body-state snapshot.",
    recommendedChoice: "Rate the state you feel right now, without trying to improve it first.",
    exampleResult: "Energy 3/5, stress 2/5, sitting too long is affecting me.",
    inputSchema: [
      { id: "energy", type: "rating", label: "Energy right now", required: true, min: 1, max: 5 },
      { id: "stress", type: "rating", label: "Stress right now", required: true, min: 1, max: 5 },
      { id: "body-factor", type: "shortText", label: "What affects your body most right now?", placeholder: "For example: sitting too long", example: "Sitting too long is affecting me.", required: true }
    ]
  },
  "mind-root": {
    actionTitle: "Clear the workspace and choose one physical next step",
    concreteOutcome: "One distracting surface is closed and one immediately startable action is saved.",
    recommendedChoice: "Close unrelated tabs and continue the task already closest to completion.",
    exampleResult: "Open the registration page file and finish the email field.",
    inputSchema: [
      { id: "workspace-cleared", type: "confirmation", label: "I closed unrelated tabs, apps or materials.", required: true },
      { id: "next-step", type: "shortText", label: "What physical action will you do next?", placeholder: "Open… / Send… / Finish…", example: "Open the registration page file and finish the email field.", required: true }
    ]
  },
  "finance-root": {
    actionTitle: "Enter four numbers for a money snapshot",
    concreteOutcome: "Current balance, expected monthly income, fixed costs and flexible spending are saved.",
    recommendedChoice: "Use approximate numbers if exact values are not available within two minutes.",
    exampleResult: "Balance 1200; income 2100; fixed costs 1250; flexible spending 500.",
    inputSchema: [
      { id: "balance", type: "number", label: "Current available balance", required: true },
      { id: "income", type: "number", label: "Expected income this month", required: true },
      { id: "fixed-costs", type: "number", label: "Fixed monthly costs", required: true },
      { id: "flexible-spending", type: "number", label: "Expected flexible spending", required: true }
    ]
  },
  "business-root": {
    actionTitle: "Set the project for this chapter",
    concreteOutcome: "One current project and its desired visible result are saved as your focus object.",
    recommendedChoice: "Choose the project already closest to a useful visible version.",
    exampleResult: "Taskovo — a working registration screen ready to show.",
    inputSchema: [
      { id: "project-type", type: "singleChoice", label: "What will you work on?", required: true, allowCustomChoice: true, choices: [
        { id: "site-app", label: "Website or application" }, { id: "document-process", label: "Work document or process" }, { id: "service-business", label: "Service or business idea" }, { id: "creative-project", label: "Creative project" }
      ] },
      { id: "project-name", type: "shortText", label: "Project name", placeholder: "For example: Taskovo", required: true },
      { id: "desired-result", type: "shortText", label: "What visible result should exist?", example: "A working registration screen ready to show.", required: true }
    ]
  },
  "career-root": {
    actionTitle: "Choose the nearest career target",
    concreteOutcome: "One practical career target is saved for this chapter.",
    recommendedChoice: "Choose the option that can create visible evidence within 30 days.",
    exampleResult: "Create one portfolio case for frontend roles.",
    inputSchema: [{ id: "career-target", type: "singleChoice", label: "What is your nearest career target?", required: true, allowCustomChoice: true, choices: [
      { id: "prove-skill", label: "Create visible proof of a skill" }, { id: "improve-profile", label: "Improve CV or professional profile" }, { id: "learn-skill", label: "Learn one role-relevant skill" }, { id: "explore-role", label: "Explore a realistic new role" }
    ] }]
  },
  "relationships-root": {
    actionTitle: "Choose one person for intentional contact",
    concreteOutcome: "One relationship is saved as the current connection focus.",
    recommendedChoice: "Choose someone important whom you have not contacted recently.",
    exampleResult: "Anna — send a real check-in this week.",
    inputSchema: [
      { id: "person-name", type: "shortText", label: "Person's name", placeholder: "For example: Anna", required: true },
      { id: "connection-outcome", type: "singleChoice", label: "What would be a useful next step?", required: true, choices: [
        { id: "message", label: "Send a meaningful message" }, { id: "call", label: "Arrange a short call" }, { id: "meet", label: "Suggest a simple meeting" }, { id: "thanks", label: "Send a specific thank-you" }
      ] }
    ]
  },
  "creativity-root": {
    actionTitle: "Choose a creative format and make a ten-minute draft",
    concreteOutcome: "One creative medium is saved and a first draft exists.",
    recommendedChoice: "Use the format requiring the least setup right now.",
    exampleResult: "Writing — a rough opening paragraph saved in notes.",
    inputSchema: [{ id: "creative-medium", type: "singleChoice", label: "Which format will you use?", required: true, allowCustomChoice: true, choices: [
      { id: "writing", label: "Writing" }, { id: "drawing-design", label: "Drawing or design" }, { id: "photo-video", label: "Photo or video" }, { id: "music-audio", label: "Music or audio" }
    ] }]
  }
};

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

export function getMissionDefinition(technology: LifeTechnology): MissionDefinition {
  const mission = getTechnologyMission(technology);
  const minMinutes = mission.durationMinMinutes ?? Math.max(1, Math.round(mission.minDurationSeconds / 60));
  const maxMinutes = mission.durationMaxMinutes ?? minMinutes;
  const base: MissionDefinition = {
    id: `technology:${technology.id}`,
    technologyId: technology.id,
    actionTitle: mission.actionTitle ?? mission.action,
    concreteOutcome: mission.successCriteria ?? technology.requirements[0]?.label ?? mission.action,
    whyItMatters: mission.actionDescription ?? technology.description,
    duration: { minMinutes, maxMinutes, label: mission.durationLabel },
    minimumDurationSeconds: mission.minDurationSeconds,
    cooldown: {
      personalSeconds: mission.personalCooldownSeconds ?? mission.cooldownSeconds,
      globalType: mission.globalCooldownType ?? "standard"
    },
    exactSteps: (mission.exactSteps ?? []).map((instruction, index) => ({ id: `step-${index + 1}`, instruction })),
    completionCriteria: mission.successCriteria ?? technology.requirements[0]?.label ?? "Complete the guided action.",
    inputSchema: [{ id: "result", type: "shortText", label: "What became available after this session?", placeholder: "Describe one visible result", example: mission.actionDescription ?? mission.successCriteria, required: true }],
    recommendedChoice: "Complete the smallest visible version described in the mission steps.",
    exampleResult: mission.actionDescription ?? mission.successCriteria,
    whatCounts: mission.whatCounts,
    whatDoesNotCount: mission.whatDoesNotCount,
    rewards: technology.rewards
  };
  return { ...base, ...guidedRootMissions[technology.id] };
}

export function hasRequiredMissionAnswers(definition: MissionDefinition, answers: Record<string, unknown>) {
  return definition.inputSchema.every((input: MissionInput) => {
    if (!input.required) return true;
    const value = answers[input.id];
    if (Array.isArray(value)) return value.length > 0;
    if (typeof value === "boolean") return value;
    if (typeof value === "number") return Number.isFinite(value);
    return typeof value === "string" && value.trim().length > 0;
  });
}
