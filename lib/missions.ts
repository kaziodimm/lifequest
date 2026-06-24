import type { LifeCategory, LifeTechnology, MissionDefinition, MissionInput, TechnologyMission } from "./types";

const guidedRootMissions: Record<string, Partial<MissionDefinition>> = {
  "health-root": {
    actionTitle: "Reset your body with one tiny action",
    concreteOutcome: "Water, breathing and a 60-second shoulder or neck stretch are completed before you save the result.",
    recommendedChoice: "Stand up, drink water, take 10 slow breaths, then stretch shoulders or neck for 60 seconds.",
    exampleResult: "Action complete; energy 3/5; body signal: neck feels tight after sitting.",
    inputSchema: [
      { id: "body-reset-completed", type: "confirmation", label: "I stood up, drank water, breathed slowly and stretched for 60 seconds.", required: true },
      { id: "energy-after", type: "rating", label: "Energy after the reset", required: true, min: 1, max: 5 },
      { id: "body-factor", type: "shortText", label: "One body signal you noticed", placeholder: "For example: tight neck after sitting", example: "My neck feels tight after sitting.", required: true }
    ]
  },
  "mind-root": {
    actionTitle: "Clear the workspace and choose one physical next step",
    concreteOutcome: "One distracting surface is closed and one immediately startable 5-minute action is saved.",
    recommendedChoice: "Close unrelated tabs or apps, clear one visible distraction, then choose a task you can start for 5 minutes.",
    exampleResult: "Open the registration page file and finish the email field.",
    inputSchema: [
      { id: "workspace-cleared", type: "confirmation", label: "I closed unrelated tabs, apps or materials.", required: true },
      { id: "next-step", type: "shortText", label: "What physical action will you do next?", placeholder: "Open… / Send… / Finish…", example: "Open the registration page file and finish the email field.", required: true }
    ]
  },
  "finance-root": {
    actionTitle: "Open your money source and save a basic snapshot",
    concreteOutcome: "Bank app, notes or spreadsheet opened; four basic numbers or a recurring payment are recorded.",
    recommendedChoice: "Open one money source now and use approximate numbers if exact values are not available within two minutes.",
    exampleResult: "Opened bank app; balance 1200; income 2100; fixed costs 1250; flexible spending 500.",
    inputSchema: [
      { id: "balance", type: "number", label: "Current available balance", required: true },
      { id: "income", type: "number", label: "Expected income this month", required: true },
      { id: "fixed-costs", type: "number", label: "Fixed monthly costs", required: true },
      { id: "flexible-spending", type: "number", label: "Expected flexible spending", required: true },
      { id: "money-source-opened", type: "confirmation", label: "I opened a bank app, notes or spreadsheet before saving this snapshot.", required: true }
    ]
  },
  "business-root": {
    actionTitle: "Open a project file and create one tiny artifact",
    concreteOutcome: "A real project surface is opened and one visible artifact or change exists.",
    recommendedChoice: "Open the project already closest to a useful visible version and create the smallest visible change.",
    exampleResult: "Opened Habidoo notes; added a rough registration screen checklist.",
    inputSchema: [
      { id: "project-type", type: "singleChoice", label: "What will you work on?", required: true, allowCustomChoice: true, choices: [
        { id: "site-app", label: "Website or application" }, { id: "document-process", label: "Work document or process" }, { id: "service-business", label: "Service or business idea" }, { id: "creative-project", label: "Creative project" }
      ] },
      { id: "project-name", type: "shortText", label: "Project name", placeholder: "For example: my project", required: true },
      { id: "desired-result", type: "shortText", label: "What visible result should exist?", example: "A working registration screen ready to show.", required: true },
      { id: "visible-artifact", type: "shortText", label: "What tiny visible artifact exists now?", placeholder: "For example: outline, draft, screen, checklist", required: true }
    ]
  },
  "career-root": {
    actionTitle: "Save one opportunity or update one career surface",
    concreteOutcome: "One target role and one saved career item now exist.",
    recommendedChoice: "Save a realistic role/opportunity or update one CV, profile or portfolio line.",
    exampleResult: "Frontend developer; saved one React role and updated one portfolio line.",
    inputSchema: [{ id: "career-target", type: "singleChoice", label: "What is your nearest career target?", required: true, allowCustomChoice: true, choices: [
      { id: "prove-skill", label: "Create visible proof of a skill" }, { id: "improve-profile", label: "Improve CV or professional profile" }, { id: "learn-skill", label: "Learn one role-relevant skill" }, { id: "explore-role", label: "Explore a realistic new role" }
    ] },
      { id: "career-saved-item", type: "shortText", label: "What did you save or update?", placeholder: "Role link, CV line, profile line or portfolio item", required: true }]
  },
  "relationships-root": {
    actionTitle: "Send or draft one meaningful message",
    concreteOutcome: "A real person, contact method and next step are saved after a concrete message action.",
    recommendedChoice: "Send it if appropriate; otherwise save a complete draft ready to send.",
    exampleResult: "Anna — drafted a specific check-in by WhatsApp; next step: send tonight.",
    inputSchema: [
      { id: "person-name", type: "shortText", label: "Person's name", placeholder: "For example: Anna", required: true },
      { id: "contact-method", type: "singleChoice", label: "Where did you send or draft it?", required: true, allowCustomChoice: true, choices: [
        { id: "message", label: "Messenger or SMS" }, { id: "email", label: "Email" }, { id: "call", label: "Call note" }, { id: "social", label: "Social app" }
      ] },
      { id: "connection-outcome", type: "shortText", label: "What is the next step?", placeholder: "Send tonight / wait for reply / suggest a call", required: true }
    ]
  },
  "creativity-root": {
    actionTitle: "Create a rough draft for 10 minutes",
    concreteOutcome: "One creative medium is selected and a rough saved artifact exists now.",
    recommendedChoice: "Use the format requiring the least setup right now and stop after a rough first version.",
    exampleResult: "Writing — a rough opening paragraph saved in notes.",
    inputSchema: [{ id: "creative-medium", type: "singleChoice", label: "Which format did you use?", required: true, allowCustomChoice: true, choices: [
      { id: "writing", label: "Writing" }, { id: "drawing-design", label: "Drawing or design" }, { id: "photo-video", label: "Photo or video" }, { id: "music-audio", label: "Music or audio" }
    ] },
      { id: "draft-created", type: "confirmation", label: "I created and saved a rough 10-minute draft.", required: true },
      { id: "draft-result", type: "shortText", label: "What exists now?", placeholder: "Rough paragraph, sketch, clip, melody…", required: true }]
  },
  "morning-walk": {
    actionTitle: "Walk outside for 10 minutes",
    concreteOutcome: "One real 10-minute walk and the energy change are recorded.",
    recommendedChoice: "Walk the easiest familiar route without optimizing distance or pace.",
    exampleResult: "Walk completed; energy changed from 2/5 to 3/5.",
    inputSchema: [
      { id: "walk-completed", type: "confirmation", label: "I walked outside for at least 10 minutes.", required: true },
      { id: "energy-after", type: "rating", label: "Energy after the walk", min: 1, max: 5, required: true }
    ]
  },
  "reading-ritual": {
    actionTitle: "Read one prepared source and save one useful idea",
    concreteOutcome: "One source is read and one reusable idea is saved.",
    recommendedChoice: "Continue the source you already started instead of searching for a new one.",
    exampleResult: "Read 10 pages; saved the idea of reducing setup before focused work.",
    inputSchema: [
      { id: "reading-choice", type: "singleChoice", label: "What did you read?", required: true, allowCustomChoice: true, choices: [
        { id: "book", label: "A book already in progress" }, { id: "article", label: "One saved article" }, { id: "course-note", label: "Notes from a course or lesson" }
      ] },
      { id: "key-idea", type: "shortText", label: "What useful idea will you keep?", placeholder: "One sentence you can reuse", required: true }
    ]
  },
  "expense-tracking": {
    actionTitle: "Record every payment from today",
    concreteOutcome: "Today's payments and the largest spending category are saved.",
    recommendedChoice: "Use your banking history and include cash purchases you remember.",
    exampleResult: "Recorded 6 payments; the largest category was food.",
    inputSchema: [
      { id: "payment-count", type: "number", label: "How many payments did you record?", required: true },
      { id: "largest-category", type: "singleChoice", label: "Which category was largest?", required: true, allowCustomChoice: true, choices: [
        { id: "housing", label: "Housing" }, { id: "food", label: "Food" }, { id: "transport", label: "Transport" }, { id: "subscriptions", label: "Subscriptions" }
      ] }
    ]
  },
  "project-definition": {
    actionTitle: "Define one visible deliverable and one boundary",
    concreteOutcome: "The next deliverable and what is outside its scope are saved.",
    recommendedChoice: "Choose the smallest deliverable another person could see or use.",
    exampleResult: "Registration screen; payment and account settings are outside this version.",
    inputSchema: [
      { id: "deliverable", type: "singleChoice", label: "What will become visible?", required: true, allowCustomChoice: true, choices: [
        { id: "screen", label: "One working screen" }, { id: "document", label: "One complete document section" }, { id: "process", label: "One usable process" }, { id: "prototype", label: "One showable prototype" }
      ] },
      { id: "boundary", type: "shortText", label: "What is explicitly outside this version?", placeholder: "Not included in this version…", required: true }
    ]
  },
  "opportunity-scan": {
    actionTitle: "Save one realistic professional opportunity",
    concreteOutcome: "One target role and one concrete opportunity are saved.",
    recommendedChoice: "Choose an opportunity that matches at least half of your current skills.",
    exampleResult: "Frontend developer; saved a role requiring React and basic testing.",
    inputSchema: [
      { id: "target-role", type: "shortText", label: "Which role or direction are you scanning?", required: true },
      { id: "opportunity-source", type: "singleChoice", label: "Where did you find the opportunity?", required: true, choices: [
        { id: "job", label: "Job listing" }, { id: "project", label: "Project or freelance request" }, { id: "person", label: "Conversation or recommendation" }
      ] },
      { id: "saved-opportunity", type: "shortText", label: "What opportunity did you save?", placeholder: "Role, project or next contact", required: true }
    ]
  },
  "weekly-check-in": {
    actionTitle: "Make one genuine check-in",
    concreteOutcome: "One intentional contact and its result are recorded.",
    recommendedChoice: "Send a short specific message to the person already selected as your focus.",
    exampleResult: "Sent Anna a real check-in; agreed to call on Friday.",
    inputSchema: [
      { id: "contact-method", type: "singleChoice", label: "How did you make contact?", required: true, choices: [
        { id: "message", label: "Meaningful message" }, { id: "call", label: "Short call" }, { id: "meeting", label: "Meeting arranged or completed" }
      ] },
      { id: "contact-result", type: "shortText", label: "What happened after the contact?", placeholder: "One concrete response or next step", required: true }
    ]
  },
  "reference-study": {
    actionTitle: "Study one reference and extract one principle",
    concreteOutcome: "One reference and one principle for your own work are saved.",
    recommendedChoice: "Use a reference you already admire instead of searching for the perfect example.",
    exampleResult: "Studied one landing page; kept the principle of one clear action per section.",
    inputSchema: [
      { id: "reference-type", type: "singleChoice", label: "What reference did you study?", required: true, allowCustomChoice: true, choices: [
        { id: "article", label: "Article or text" }, { id: "design", label: "Design or illustration" }, { id: "video", label: "Video or photo" }, { id: "book", label: "Book or long-form work" }
      ] },
      { id: "principle", type: "shortText", label: "Which principle will you try in your own work?", placeholder: "One specific principle", required: true }
    ]
  },
  "awakening-trial": {
    actionTitle: "Complete the chapter review",
    concreteOutcome: "A Chapter Summary is saved from real completed branches and practices.",
    recommendedChoice: "Choose practices you actually completed and can repeat next week.",
    exampleResult: "Three carried practices, one personal rule and one weekly standard saved.",
    inputSchema: [
      { id: "reviewed-branches", type: "checklist", label: "Reviewed completed branches", required: true },
      { id: "carried-practices", type: "multiChoice", label: "Three practices to carry forward", required: true },
      { id: "personal-rule", type: "text", label: "One personal rule for the next chapter", placeholder: "When X happens, I will do Y.", required: true },
      { id: "weekly-standard", type: "text", label: "Realistic weekly standard", placeholder: "Minimum repeatable standard for a normal week.", required: true },
      { id: "chapter-confirmed", type: "confirmation", label: "This summary is realistic enough to carry into the next chapter.", required: true }
    ]
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
