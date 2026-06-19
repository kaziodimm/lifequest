import type { GlobalCooldownType, LifeCategory, LifeTechnology, TechnologyNodeType } from "./types";

export const categoryLabels: Record<LifeCategory, string> = {
  health: "Body & Energy",
  mind: "Focus & Mind",
  career: "Direction & Career",
  business: "Build & Create",
  finance: "Money & Freedom",
  relationships: "People & Connection",
  creativity: "Creative Practice"
};

export const categoryColors: Record<LifeCategory, string> = {
  health: "#74d680",
  mind: "#9b7cff",
  career: "#4ce0d2",
  business: "#f6c453",
  finance: "#55b8ff",
  relationships: "#ff8ab3",
  creativity: "#ff9f5a"
};

type Seed = {
  id: string;
  category: LifeCategory;
  title: string;
  icon: string;
  description: string;
  parents?: string[];
  requiredParentCount?: number;
  unlocks?: string[];
  target?: number;
  requirement?: string;
  type?: TechnologyNodeType;
  actionTitle?: string;
  actionDescription?: string;
  steps?: string[];
  duration?: [number, number];
  minimumSeconds?: number;
  personalCooldownHours?: number;
  globalCooldownType?: GlobalCooldownType;
  whatCounts?: string;
  whatDoesNotCount?: string;
  branch?: string;
};

const globalCooldownSeconds: Record<GlobalCooldownType, number> = {
  micro: 15 * 60,
  standard: 30 * 60,
  deep: 60 * 60
};

function technology(seed: Seed): LifeTechnology {
  const type = seed.type ?? "technology";
  const duration = seed.duration ?? (type === "challenge" ? [30, 60] : [10, 20]);
  const globalType = seed.globalCooldownType ?? (duration[1] <= 10 ? "micro" : duration[1] <= 40 ? "standard" : "deep");
  const target = seed.target ?? 1;

  return {
    id: seed.id,
    category: seed.category,
    chapter: 1,
    branch: seed.branch ?? categoryLabels[seed.category],
    type,
    era: "foundation",
    title: seed.title,
    shortTitle: seed.title,
    description: seed.description,
    icon: seed.icon,
    xpReward: type === "challenge" ? 220 : type === "milestone" ? 140 : 50 + Math.min(target, 10) * 8,
    requirements: [{ label: seed.requirement ?? `Complete ${target} time${target === 1 ? "" : "s"}`, current: 0, target }],
    parents: seed.parents ?? [],
    requiredParentCount: seed.requiredParentCount,
    unlocks: seed.unlocks ?? [],
    x: 0,
    y: 0,
    mission: {
      action: seed.actionDescription ?? seed.actionTitle ?? seed.title,
      actionTitle: seed.actionTitle ?? seed.title,
      actionDescription: seed.actionDescription ?? seed.description,
      exactSteps: seed.steps ?? [],
      successCriteria: seed.requirement ?? `Complete ${target} time${target === 1 ? "" : "s"}`,
      durationMinMinutes: duration[0],
      durationMaxMinutes: duration[1],
      durationLabel: `${duration[0]}-${duration[1]} minutes`,
      minDurationSeconds: seed.minimumSeconds ?? duration[0] * 60,
      cooldownSeconds: (seed.personalCooldownHours ?? 2) * 60 * 60,
      personalCooldownSeconds: (seed.personalCooldownHours ?? 2) * 60 * 60,
      globalCooldownType: globalType,
      progressGain: 1,
      whatCounts: seed.whatCounts,
      whatDoesNotCount: seed.whatDoesNotCount
    }
  };
}

const health: Seed[] = [
  { id: "health-root", category: "health", title: "Body Awareness", icon: "eye", description: "Learn to notice your energy before trying to improve it.", target: 5, requirement: "Complete check-ins on 5 days", unlocks: ["morning-walk", "hydration", "evening-shutdown", "mobility-primer"], actionTitle: "3 Energy Check-ins", actionDescription: "Three times during the day, pause and rate your current body state.", steps: ["Stop what you are doing.", "Take 3 slow breaths.", "Rate energy from 1 to 5.", "Rate stress from 1 to 5.", "Write: What affects me right now?"], duration: [2, 3], globalCooldownType: "micro", whatCounts: "A written check-in with energy, stress and one note.", whatDoesNotCount: "Pressing complete without writing anything." },
  { id: "morning-walk", category: "health", title: "Morning Walk", icon: "footprints", description: "Build a calm outdoor movement rhythm.", parents: ["health-root"], unlocks: ["light-cardio", "daily-movement"], target: 8, requirement: "Complete 8 walks", actionTitle: "15 Minute Morning Walk", actionDescription: "Walk outside for at least 15 continuous minutes.", steps: ["Leave home or work.", "Walk continuously for at least 15 minutes.", "Do not combine it with shopping or errands.", "Keep phone scrolling closed."], duration: [15, 25], personalCooldownHours: 12, whatCounts: "Intentional outdoor or treadmill walking.", whatDoesNotCount: "Work movement, walking inside home or errands." },
  { id: "hydration", category: "health", title: "Hydration Reset", icon: "droplet", description: "Put water before stimulants.", parents: ["health-root"], unlocks: ["simple-nutrition"], target: 10, requirement: "Complete on 10 days", actionTitle: "Water Before Caffeine", steps: ["Fill a glass or bottle.", "Drink at least 300 ml.", "Do this before coffee, energy drink or soda.", "Mark complete only after drinking."], duration: [1, 3], personalCooldownHours: 8, globalCooldownType: "micro", whatCounts: "Water or unsweetened sparkling water.", whatDoesNotCount: "Coffee, tea, soda, juice or alcohol." },
  { id: "evening-shutdown", category: "health", title: "Evening Shutdown", icon: "moon", description: "Create a deliberate ending to the day.", parents: ["health-root"], unlocks: ["sleep-anchor"], target: 7, requirement: "Complete 7 evenings", actionTitle: "10 Minute Shutdown", steps: ["Put the phone away or enable do-not-disturb.", "Prepare essentials for tomorrow.", "Write: Tomorrow starts with...", "Turn off unnecessary lights."], duration: [10, 10], personalCooldownHours: 12, whatCounts: "A deliberate routine before sleep.", whatDoesNotCount: "Falling asleep while scrolling." },
  { id: "daily-movement", category: "health", title: "Daily Movement", icon: "activity", description: "Make intentional movement a normal session.", parents: ["morning-walk"], unlocks: ["movement-established"], target: 6, requirement: "Complete 6 sessions", actionTitle: "20 Minutes of Movement", steps: ["Choose brisk walking, cycling, stairs, home movement or an active stretching flow.", "Move intentionally for at least 20 minutes."], duration: [20, 30], personalCooldownHours: 12, whatCounts: "A deliberate movement session.", whatDoesNotCount: "Normal work activity or random walking." },
  { id: "light-cardio", category: "health", title: "Light Cardio", icon: "heart", description: "Build easy aerobic capacity without overreaching.", parents: ["morning-walk"], unlocks: ["first-endurance-trial"], target: 4, requirement: "Complete 4 sessions", actionTitle: "Light Cardio Session", steps: ["Warm up for 3 minutes.", "Move continuously for 15-20 minutes.", "Keep intensity moderate.", "You should be able to talk, but not sing."], duration: [20, 30], personalCooldownHours: 12, whatCounts: "Fast walking, cycling, treadmill, elliptical or easy jogging.", whatDoesNotCount: "Heavy workouts or less than 15 minutes." },
  { id: "mobility-primer", category: "health", title: "Mobility Primer", icon: "accessibility", description: "Open the body with a short repeatable sequence.", parents: ["health-root"], unlocks: ["movement-established"], target: 6, requirement: "Complete 6 sessions", actionTitle: "8 Minute Mobility Routine", steps: ["Neck circles — 30 seconds.", "Shoulder circles — 60 seconds.", "Hip circles — 60 seconds.", "10 bodyweight squats.", "Forward fold — 60 seconds.", "Cat-cow or back mobility — 60 seconds.", "Easy breathing — 60 seconds."], duration: [8, 12], personalCooldownHours: 12, whatCounts: "The complete sequence done slowly.", whatDoesNotCount: "Random stretching under 5 minutes." },
  { id: "simple-nutrition", category: "health", title: "Simple Nutrition", icon: "apple", description: "Make one meal easier to understand.", parents: ["hydration"], unlocks: ["movement-established"], target: 5, requirement: "Complete 5 simple meals", actionTitle: "Build One Simple Meal", steps: ["Choose one protein source.", "Add one fruit or vegetable.", "Add one practical carbohydrate.", "Eat without phone scrolling."], duration: [10, 25], personalCooldownHours: 8, whatCounts: "A deliberately assembled meal.", whatDoesNotCount: "Logging a meal you did not choose intentionally." },
  { id: "sleep-anchor", category: "health", title: "Sleep Anchor", icon: "bed", description: "Give sleep one repeatable anchor.", parents: ["evening-shutdown"], unlocks: ["movement-established"], target: 5, requirement: "Keep the anchor for 5 nights", actionTitle: "Set a Sleep Anchor", steps: ["Choose a realistic lights-out time.", "Set an alarm 15 minutes before it.", "Begin the evening shutdown at the alarm.", "Record the actual lights-out time."], duration: [10, 15], personalCooldownHours: 12 },
  { id: "movement-established", category: "health", title: "Movement Established", icon: "star", type: "milestone", description: "You have created your first body rhythm.", parents: ["health-root", "morning-walk", "daily-movement", "light-cardio", "mobility-primer", "simple-nutrition", "sleep-anchor"], requiredParentCount: 3, unlocks: ["first-endurance-trial"], actionTitle: "Confirm Your Body Rhythm", steps: ["Review the body missions you completed.", "Write one rhythm you can keep next month."], duration: [3, 5], globalCooldownType: "micro" },
  { id: "first-endurance-trial", category: "health", title: "First Endurance Trial", icon: "trophy", type: "challenge", description: "Prove that movement can repeat across different days.", parents: ["movement-established", "light-cardio", "morning-walk"], requiredParentCount: 3, target: 3, requirement: "Complete 3 sessions on different days within 7 days", actionTitle: "7 Day Endurance Trial", steps: ["Complete 3 intentional movement sessions.", "Make each session at least 20 minutes.", "Use three different days."], duration: [20, 40], personalCooldownHours: 20, whatCounts: "Walking, cardio, cycling, mobility flow or an easy workout.", whatDoesNotCount: "Multiple sessions on one day, work activity or fake short sessions." }
];

const mind: Seed[] = [
  { id: "mind-root", category: "mind", title: "Mental Clarity", icon: "brain", description: "Create mental space before scattered attention takes over.", target: 5, requirement: "Complete on 5 days", unlocks: ["reading-ritual", "focus-sprint", "reflection-note"], actionTitle: "3 Minute Mental Reset", steps: ["Sit or stand still.", "Close unrelated tabs or apps.", "Take 5 slow breaths.", "Write the one thing holding your attention.", "Write the next tiny action."], duration: [3, 5], globalCooldownType: "micro" },
  { id: "reading-ritual", category: "mind", title: "Reading Ritual", icon: "book", description: "Read deeply enough to keep one useful idea.", parents: ["mind-root"], unlocks: ["knowledge-seed"], target: 8, requirement: "Complete 8 sessions", actionTitle: "Read 10 Pages or 15 Minutes", steps: ["Choose a book, serious article, course text or documentation.", "Put the phone away.", "Read 15 minutes or 10 pages.", "Write one sentence about what you learned."], duration: [15, 25], personalCooldownHours: 2, whatCounts: "Books, long-form educational text, course material or documentation.", whatDoesNotCount: "Social media, headlines or random browsing." },
  { id: "focus-sprint", category: "mind", title: "Focus Sprint", icon: "target", description: "Protect one clear task for a short block.", parents: ["mind-root"], unlocks: ["deep-work-gate"], target: 6, requirement: "Complete 6 sessions", actionTitle: "25 Minute Focus Block", steps: ["Choose one clear task.", "Set a 25 minute timer.", "Remove phone distractions.", "Work only on that task.", "Write what was completed."], duration: [25, 30], personalCooldownHours: 2 },
  { id: "reflection-note", category: "mind", title: "Reflection Note", icon: "notebook", description: "Turn a day into one useful adjustment.", parents: ["mind-root"], unlocks: ["self-awareness"], target: 7, requirement: "Complete 7 days", actionTitle: "Daily Reflection", steps: ["Write what gave you energy today.", "Write what drained your energy.", "Write one small improvement for tomorrow."], duration: [5, 10], globalCooldownType: "micro" },
  { id: "knowledge-seed", category: "mind", title: "Knowledge Seed", icon: "sprout", description: "Translate reading into a usable idea.", parents: ["reading-ritual"], unlocks: ["mind-awake"], target: 5, requirement: "Save 5 useful ideas", actionTitle: "Save One Useful Idea", steps: ["Choose one idea from your reading.", "Write it in your own words.", "Add one possible real-life use."], duration: [5, 10], globalCooldownType: "micro" },
  { id: "deep-work-gate", category: "mind", title: "Deep Work Gate", icon: "lock", description: "Hold attention on one meaningful task.", parents: ["focus-sprint"], unlocks: ["mind-awake"], target: 3, requirement: "Complete 3 sessions", actionTitle: "45 Minute Protected Session", steps: ["Choose one meaningful task.", "Set a 45 minute timer.", "No phone, chat or switching.", "Work until the timer ends.", "Write the outcome in one sentence."], duration: [45, 60], personalCooldownHours: 4, globalCooldownType: "deep" },
  { id: "self-awareness", category: "mind", title: "Self Awareness", icon: "eye", description: "Notice one repeated mental pattern.", parents: ["reflection-note"], unlocks: ["mind-awake"], target: 3, requirement: "Record 3 recurring patterns", actionTitle: "Name One Pattern", steps: ["Review your reflection notes.", "Circle one repeated drain or trigger.", "Write one response you want to test."], duration: [10, 15] },
  { id: "mind-awake", category: "mind", title: "Mind Awake", icon: "star", type: "milestone", description: "Your attention now has a basic operating rhythm.", parents: ["mind-root", "reading-ritual", "focus-sprint", "reflection-note", "knowledge-seed", "deep-work-gate", "self-awareness"], requiredParentCount: 3, unlocks: ["attention-trial"], actionTitle: "Confirm Your Attention Rhythm", steps: ["Review your completed focus missions.", "Write the practice you will continue."], duration: [3, 5], globalCooldownType: "micro" },
  { id: "attention-trial", category: "mind", title: "Attention Trial", icon: "trophy", type: "challenge", description: "Prove that protected attention can repeat across a week.", parents: ["mind-awake", "focus-sprint"], requiredParentCount: 2, target: 4, requirement: "Complete 4 focus sessions on different days within 7 days", actionTitle: "7 Day Attention Trial", steps: ["Complete 4 focus sessions.", "Keep each session at least 25 minutes.", "Count no more than one session per day."], duration: [25, 45], personalCooldownHours: 20 }
];

const finance: Seed[] = [
  { id: "finance-root", category: "finance", title: "Money Awareness", icon: "coins", description: "See money clearly without pressure.", unlocks: ["expense-tracking", "spending-categories", "savings-seed"], actionTitle: "Create a Money Snapshot", steps: ["Write your current account balance.", "Write expected income this month.", "Write fixed expenses.", "Write: My biggest money leak might be..."], duration: [15, 25] },
  { id: "expense-tracking", category: "finance", title: "Expense Tracking", icon: "receipt", description: "Make daily spending visible.", parents: ["finance-root"], unlocks: ["spending-pattern"], target: 10, requirement: "Track 10 full days", actionTitle: "Track Every Payment Today", steps: ["List every payment at the end of the day.", "Include cash, card and online payments.", "Add a category to each payment."], duration: [5, 10], whatCounts: "A complete day with every payment categorized.", whatDoesNotCount: "A partial list or guessed total." },
  { id: "spending-categories", category: "finance", title: "Spending Categories", icon: "folder", description: "Give every expense a clear place.", parents: ["finance-root"], unlocks: ["budget-snapshot"], actionTitle: "Create Spending Categories", steps: ["Create housing, food, transport, subscriptions, fun, debt, savings and other categories.", "Move recent expenses into them."], duration: [10, 15] },
  { id: "savings-seed", category: "finance", title: "Savings Seed", icon: "piggy-bank", description: "Start a buffer with a realistic amount.", parents: ["finance-root"], unlocks: ["emergency-buffer"], actionTitle: "Set Aside a Small Amount", steps: ["Choose any realistic amount.", "Move it to savings or a separate space.", "Write why this buffer matters."], duration: [5, 10], globalCooldownType: "micro" },
  { id: "spending-pattern", category: "finance", title: "Spending Pattern", icon: "search", description: "Find the behavior behind the numbers.", parents: ["expense-tracking"], unlocks: ["financial-visibility"], actionTitle: "Review 7 Tracked Days", steps: ["Review the last 7 tracked days.", "Find the top 3 spending categories.", "Write one spending habit to watch."], duration: [15, 20] },
  { id: "budget-snapshot", category: "finance", title: "Budget Snapshot", icon: "chart", description: "Create a simple monthly view.", parents: ["spending-categories"], unlocks: ["financial-visibility"], actionTitle: "Build a Monthly Budget View", steps: ["List monthly income.", "List fixed costs.", "Estimate variable costs.", "Write the amount available after costs."], duration: [20, 30] },
  { id: "emergency-buffer", category: "finance", title: "Emergency Buffer", icon: "shield", description: "Define a small first safety target.", parents: ["savings-seed"], unlocks: ["financial-visibility"], actionTitle: "Define Your First Buffer", steps: ["Choose a small first target.", "Write where the money will stay.", "Write what counts as an emergency."], duration: [10, 15] },
  { id: "financial-visibility", category: "finance", title: "Financial Visibility", icon: "star", type: "milestone", description: "You can now see your basic money system.", parents: ["finance-root", "expense-tracking", "spending-pattern", "budget-snapshot", "emergency-buffer"], requiredParentCount: 3, unlocks: ["money-clarity-trial"], actionTitle: "Confirm Financial Visibility", steps: ["Review your snapshot and tracking.", "Write the one number you will review weekly."], duration: [5, 10], globalCooldownType: "micro" },
  { id: "money-clarity-trial", category: "finance", title: "Money Clarity Trial", icon: "trophy", type: "challenge", description: "Keep money visible for a full week.", parents: ["financial-visibility"], target: 7, requirement: "Track 7 consecutive days and review once", actionTitle: "7 Day Money Clarity Trial", steps: ["Track spending for 7 consecutive days.", "Review it once at the end.", "Write one rule for next week."], duration: [5, 20], personalCooldownHours: 20 }
];

const business: Seed[] = [
  { id: "business-root", category: "business", title: "Builder Mindset", icon: "hammer", description: "Turn one idea into visible output.", unlocks: ["project-definition", "project-sprint", "idea-capture", "ship-tiny"], actionTitle: "Choose One Small Thing to Build", steps: ["Write 3 small project ideas.", "Choose the smallest.", "Define finished in one sentence.", "Set a 30 minute first action."], duration: [20, 30] },
  { id: "project-definition", category: "business", title: "Project Definition", icon: "notebook", description: "Give a small project a clear edge and finish line.", parents: ["business-root"], unlocks: ["project-sprint"], actionTitle: "Write a One-Page Project Brief", steps: ["Name the person this project helps.", "Write the problem in one sentence.", "List the smallest useful output.", "Write what is explicitly outside the project."], duration: [15, 25] },
  { id: "idea-capture", category: "business", title: "Idea Capture", icon: "lightbulb", description: "Create options without judging them too early.", parents: ["business-root"], unlocks: ["idea-filter"], actionTitle: "Capture 10 Raw Ideas", steps: ["Open notes.", "Write 10 one-sentence ideas.", "Do not judge or research them yet."], duration: [10, 20] },
  { id: "project-sprint", category: "business", title: "Project Sprint", icon: "timer", description: "Move one project forward in a protected block.", parents: ["business-root"], unlocks: ["first-asset"], target: 5, requirement: "Complete 5 sessions", actionTitle: "30 Minute Project Sprint", steps: ["Choose one project.", "Define one output before starting.", "Work for 30 minutes.", "Save or write what changed."], duration: [30, 40], personalCooldownHours: 4 },
  { id: "idea-filter", category: "business", title: "Idea Filter", icon: "filter", description: "Choose the useful idea, not the loudest one.", parents: ["idea-capture"], unlocks: ["first-asset"], actionTitle: "Score and Choose One Idea", steps: ["Score each idea 1-5 for usefulness.", "Score ease.", "Score personal interest.", "Choose one idea to continue."], duration: [15, 25] },
  { id: "first-asset", category: "business", title: "First Asset", icon: "box", description: "Create something another person can see.", parents: ["project-sprint", "idea-filter"], requiredParentCount: 1, unlocks: ["ship-tiny"], target: 2, requirement: "Create 2 visible assets", actionTitle: "Create One Visible Asset", steps: ["Create a document, prototype, spreadsheet, mockup, demo, landing section or public note.", "Save a visible version."], duration: [30, 60], personalCooldownHours: 4, globalCooldownType: "deep" },
  { id: "ship-tiny", category: "business", title: "Ship Tiny", icon: "rocket", description: "Get feedback before polishing forever.", parents: ["business-root", "first-asset"], requiredParentCount: 1, unlocks: ["creator-started"], actionTitle: "Show Work to One Person", steps: ["Choose one asset.", "Send it to one person.", "Ask: What is unclear?", "Save the feedback."], duration: [15, 30] },
  { id: "creator-started", category: "business", title: "Creator Started", icon: "star", type: "milestone", description: "You now turn ideas into visible artifacts.", parents: ["business-root", "project-sprint", "first-asset", "ship-tiny"], requiredParentCount: 3, unlocks: ["tiny-launch-trial"], actionTitle: "Confirm Your Builder Rhythm", steps: ["Review what you built.", "Write the next smallest output."], duration: [5, 10], globalCooldownType: "micro" },
  { id: "tiny-launch-trial", category: "business", title: "Tiny Launch Trial", icon: "trophy", type: "challenge", description: "Build, finish and show one small result.", parents: ["creator-started"], target: 3, requirement: "Complete 3 sprints, create 1 asset and show it within 10 days", actionTitle: "10 Day Tiny Launch", steps: ["Complete 3 project sprints.", "Create one visible asset.", "Show it to one person."], duration: [30, 60], personalCooldownHours: 20, globalCooldownType: "deep" }
];

const career: Seed[] = [
  { id: "career-root", category: "career", title: "Career Direction", icon: "compass", description: "See your professional position clearly.", unlocks: ["opportunity-scan", "skill-inventory", "proof-item", "learning-block"], actionTitle: "Write Your Current Direction", steps: ["What do I do now?", "What do I like doing?", "What drains me?", "What skill could increase my options?"], duration: [20, 30] },
  { id: "opportunity-scan", category: "career", title: "Opportunity Scan", icon: "search", description: "Look at real options before choosing a direction in isolation.", parents: ["career-root"], unlocks: ["direction-found"], target: 3, requirement: "Review 3 realistic opportunities", actionTitle: "Review Three Real Opportunities", steps: ["Find three roles, projects or paths that interest you.", "Write the repeated skills they request.", "Circle one pattern worth exploring."], duration: [20, 30] },
  { id: "skill-inventory", category: "career", title: "Skill Inventory", icon: "briefcase", description: "Make your existing ability visible.", parents: ["career-root"], unlocks: ["skill-gap"], actionTitle: "Create a Skill Inventory", steps: ["List technical skills.", "List communication and organization skills.", "List problem-solving, languages and tools."], duration: [20, 30] },
  { id: "learning-block", category: "career", title: "Learning Block", icon: "graduation-cap", description: "Study one topic that expands your options.", parents: ["career-root"], unlocks: ["skill-gap"], target: 5, requirement: "Complete 5 sessions", actionTitle: "30 Minute Learning Block", steps: ["Choose one career-relevant topic.", "Learn for 30 minutes.", "Write 3 notes.", "Write one possible use."], duration: [30, 40], personalCooldownHours: 4 },
  { id: "proof-item", category: "career", title: "Proof Item", icon: "badge", description: "Create evidence instead of only claiming a skill.", parents: ["career-root"], unlocks: ["career-signal"], target: 3, requirement: "Create 3 proof items", actionTitle: "Create One Proof of Skill", steps: ["Create a screenshot, mini case study, document, GitHub commit, process note or before/after example.", "Save it where you can find it."], duration: [20, 45], personalCooldownHours: 4 },
  { id: "skill-gap", category: "career", title: "Skill Gap", icon: "map-pin", description: "Choose one useful gap to close.", parents: ["skill-inventory", "learning-block"], requiredParentCount: 1, unlocks: ["career-signal"], actionTitle: "Choose One Skill Gap", steps: ["Review your inventory.", "Choose one missing skill.", "Define the first learning step.", "Schedule one learning block."], duration: [10, 15] },
  { id: "career-signal", category: "career", title: "Career Signal", icon: "radio", description: "Update one professional surface people can see.", parents: ["proof-item", "skill-gap"], requiredParentCount: 1, unlocks: ["direction-found"], actionTitle: "Update One Professional Signal", steps: ["Choose a CV, LinkedIn, portfolio, GitHub README or website section.", "Update it with one clear proof or direction statement."], duration: [20, 40] },
  { id: "direction-found", category: "career", title: "Direction Found", icon: "star", type: "milestone", description: "You have a direction and the first evidence behind it.", parents: ["career-root", "skill-inventory", "proof-item", "learning-block", "career-signal"], requiredParentCount: 3, unlocks: ["professional-signal-trial"], actionTitle: "Confirm Your Direction", steps: ["Review your skills and evidence.", "Write the next professional move in one sentence."], duration: [5, 10], globalCooldownType: "micro" },
  { id: "professional-signal-trial", category: "career", title: "Professional Signal Trial", icon: "trophy", type: "challenge", description: "Connect learning, proof and visible direction.", parents: ["direction-found"], target: 2, requirement: "Complete 2 learning blocks, 1 proof item and 1 signal within 10 days", actionTitle: "10 Day Professional Signal Trial", steps: ["Complete 2 learning blocks.", "Create 1 proof item.", "Update 1 visible professional signal."], duration: [30, 60], personalCooldownHours: 20, globalCooldownType: "deep" }
];

const relationships: Seed[] = [
  { id: "relationships-root", category: "relationships", title: "Social Signal", icon: "message", description: "Create intentional contact without social pressure.", unlocks: ["weekly-check-in", "meaningful-conversation", "help-offered"], target: 5, requirement: "Complete 5 times", actionTitle: "Send One Intentional Message", steps: ["Choose one person.", "Send a real message, not only an emoji.", "Ask a simple question or share something relevant.", "Do not expect an instant reply."], duration: [5, 10], globalCooldownType: "micro" },
  { id: "weekly-check-in", category: "relationships", title: "Weekly Check-in", icon: "calendar", description: "Keep contact with someone who matters.", parents: ["relationships-root"], unlocks: ["trusted-circle"], target: 4, requirement: "Complete 4 times", actionTitle: "Check In With Someone", steps: ["Choose someone who matters.", "Send: How are things going lately? or I remembered you because..."], duration: [5, 10], globalCooldownType: "micro" },
  { id: "meaningful-conversation", category: "relationships", title: "Meaningful Conversation", icon: "users", description: "Give one conversation undivided attention.", parents: ["relationships-root"], unlocks: ["trusted-circle"], target: 3, requirement: "Complete 3 conversations", actionTitle: "15 Minute Real Conversation", steps: ["Talk by call, voice, video or in person.", "Ask at least one real question.", "Listen without multitasking.", "Write: I learned..."], duration: [15, 30] },
  { id: "help-offered", category: "relationships", title: "Help Offered", icon: "hand", description: "Offer something specific and useful.", parents: ["relationships-root"], unlocks: ["trusted-circle"], target: 2, requirement: "Complete 2 times", actionTitle: "Offer Specific Help", steps: ["Choose one person.", "Offer something concrete, such as reviewing a document.", "Avoid vague offers like let me know."], duration: [5, 15] },
  { id: "gratitude-note", category: "relationships", title: "Gratitude Note", icon: "message", description: "Make appreciation specific instead of assumed.", parents: ["relationships-root"], unlocks: ["trusted-circle"], target: 2, requirement: "Send 2 gratitude notes", actionTitle: "Send One Specific Thank You", steps: ["Choose one person.", "Name the exact thing you appreciate.", "Explain briefly why it mattered."], duration: [5, 10], globalCooldownType: "micro" },
  { id: "shared-time", category: "relationships", title: "Shared Time", icon: "calendar", description: "Turn good intentions into time on the calendar.", parents: ["weekly-check-in"], unlocks: ["trusted-circle"], actionTitle: "Arrange One Shared Moment", steps: ["Choose one person.", "Offer a concrete day and activity.", "Keep the plan small and low-pressure."], duration: [5, 15] },
  { id: "boundary-check", category: "relationships", title: "Boundary Check", icon: "shield", description: "Protect connection from resentment and overload.", parents: ["relationships-root"], unlocks: ["trusted-circle"], actionTitle: "Write One Clear Boundary", steps: ["Name one interaction that drains you.", "Write what you can realistically offer.", "Write one respectful sentence you could use."], duration: [10, 15] },
  { id: "trusted-circle", category: "relationships", title: "Trusted Circle", icon: "star", type: "milestone", description: "You have created an intentional connection rhythm.", parents: ["relationships-root", "weekly-check-in", "meaningful-conversation", "help-offered", "gratitude-note", "shared-time", "boundary-check"], requiredParentCount: 3, unlocks: ["connection-trial"], actionTitle: "Confirm Your Connection Rhythm", steps: ["Review your recent intentional contacts.", "Choose one relationship to keep nurturing."], duration: [5, 10], globalCooldownType: "micro" },
  { id: "connection-trial", category: "relationships", title: "Connection Trial", icon: "trophy", type: "challenge", description: "Create several kinds of intentional contact.", parents: ["trusted-circle"], target: 5, requirement: "Send 5 messages, have 1 conversation and offer help within 14 days", actionTitle: "14 Day Connection Trial", steps: ["Send 5 intentional messages.", "Have 1 meaningful conversation.", "Offer useful help once."], duration: [5, 30], personalCooldownHours: 20 }
];

const creativity: Seed[] = [
  { id: "creativity-root", category: "creativity", title: "Creative Spark", icon: "sparkles", description: "Start creating instead of only consuming.", unlocks: ["reference-study", "idea-sketch", "creative-session", "publish-small"], target: 5, requirement: "Complete 5 sessions", actionTitle: "Create for 10 Minutes", steps: ["Choose sketching, writing, design, music, photography, video, layout or a concept.", "Create without judging for 10 minutes.", "Save the result."], duration: [10, 15] },
  { id: "reference-study", category: "creativity", title: "Reference Study", icon: "eye", description: "Study one piece you admire without copying it.", parents: ["creativity-root"], unlocks: ["creative-session"], target: 3, requirement: "Complete 3 reference studies", actionTitle: "Break Down One Reference", steps: ["Choose one work you admire.", "Write three choices the creator made.", "Choose one principle to test in your own work."], duration: [10, 20] },
  { id: "idea-sketch", category: "creativity", title: "Idea Sketch", icon: "pencil", description: "Turn one idea into a rough visible draft.", parents: ["creativity-root"], unlocks: ["creative-session"], target: 5, requirement: "Complete 5 sketches", actionTitle: "Make One Rough Sketch", steps: ["Choose one idea.", "Make a rough draft.", "Allow it to be ugly.", "Save it."], duration: [10, 20] },
  { id: "creative-session", category: "creativity", title: "Creative Session", icon: "palette", description: "Stay with one piece long enough to make a version.", parents: ["creativity-root", "idea-sketch"], requiredParentCount: 1, unlocks: ["creative-artifact"], target: 4, requirement: "Complete 4 sessions", actionTitle: "30 Minute Creative Session", steps: ["Pick one creative piece.", "Set a 30 minute timer.", "Do not over-edit.", "Produce a visible version."], duration: [30, 40], personalCooldownHours: 4 },
  { id: "publish-small", category: "creativity", title: "Publish Small", icon: "send", description: "Give a small output a clear destination.", parents: ["creativity-root"], unlocks: ["creative-artifact"], target: 2, requirement: "Complete 2 times", actionTitle: "Share One Small Output", steps: ["Send it to a friend, post privately, save to a portfolio, publish a draft or archive it in a project folder."], duration: [10, 20] },
  { id: "creative-artifact", category: "creativity", title: "Creative Artifact", icon: "gem", description: "Finish one small creative object.", parents: ["creative-session", "publish-small"], requiredParentCount: 1, unlocks: ["creative-flame"], target: 2, requirement: "Finish 2 artifacts", actionTitle: "Finish One Small Artifact", steps: ["Choose an image, text, video draft, design, music loop, concept board or article draft.", "Finish a version you can save or share."], duration: [30, 60], personalCooldownHours: 4, globalCooldownType: "deep" },
  { id: "creative-flame", category: "creativity", title: "Creative Flame", icon: "star", type: "milestone", description: "You now create visible work repeatedly.", parents: ["creativity-root", "idea-sketch", "creative-session", "publish-small", "creative-artifact"], requiredParentCount: 3, unlocks: ["creation-trial"], actionTitle: "Confirm Your Creative Rhythm", steps: ["Review your saved outputs.", "Choose one practice to continue."], duration: [5, 10], globalCooldownType: "micro" },
  { id: "creation-trial", category: "creativity", title: "Creation Trial", icon: "trophy", type: "challenge", description: "Create, finish and clearly archive or share a result.", parents: ["creative-flame"], target: 3, requirement: "Complete 3 sessions, finish 1 artifact and share or archive it within 10 days", actionTitle: "10 Day Creation Trial", steps: ["Complete 3 creative sessions.", "Finish 1 artifact.", "Share or archive it clearly."], duration: [30, 60], personalCooldownHours: 20, globalCooldownType: "deep" }
];

const branchMilestones = ["movement-established", "mind-awake", "financial-visibility", "creator-started", "direction-found", "trusted-circle", "creative-flame"];
const awakeningTrial: Seed = {
  id: "awakening-trial",
  category: "mind",
  branch: "The Awakening",
  title: "The Awakening Trial",
  icon: "crown",
  type: "challenge",
  description: "Prove that your life system is not one-dimensional.",
  parents: branchMilestones,
  requiredParentCount: 4,
  target: 5,
  requirement: "Complete actions from 3 branches on at least 5 of 7 days",
  actionTitle: "7 Day Awakening Trial",
  steps: ["Complete actions from at least 3 different branches.", "Only one action per branch counts each day.", "Complete at least 5 days out of 7.", "All active mission and cooldown rules apply."],
  duration: [10, 60],
  personalCooldownHours: 20,
  globalCooldownType: "deep"
};

export const technologies: LifeTechnology[] = [...health, ...mind, ...finance, ...business, ...career, ...relationships, ...creativity, awakeningTrial].map(technology);

// Keep unlock lists complete even when a seed only declares parents.
const technologyById = new Map(technologies.map((item) => [item.id, item]));
technologies.forEach((item) => {
  item.parents.forEach((parentId) => {
    const parent = technologyById.get(parentId);
    if (parent && !parent.unlocks.includes(item.id)) parent.unlocks.push(item.id);
  });
});

export { globalCooldownSeconds };
