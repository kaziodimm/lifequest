import { LifeTechnology } from "./types";

export const categoryLabels = {
  health: "Health",
  mind: "Mind",
  career: "Career",
  business: "Business",
  finance: "Finance",
  relationships: "Relationships",
  creativity: "Creativity"
};

export const categoryColors = {
  health: "#74d680",
  mind: "#9b7cff",
  career: "#4ce0d2",
  business: "#f6c453",
  finance: "#55b8ff",
  relationships: "#ff8ab3",
  creativity: "#ff9f5a"
};

export const technologies: LifeTechnology[] = [
  {
    id: "health-root",
    category: "health",
    title: "Body Awareness",
    description: "Start treating your body like a core civilization system.",
    xpReward: 50,
    requirements: [{ label: "Complete 1 health mission", current: 0, target: 1 }],
    parents: [],
    unlocks: ["morning-walk", "hydration"],
    x: 120,
    y: 170
  },
  {
    id: "morning-walk",
    category: "health",
    title: "Morning Walk",
    description: "Build the first outdoor movement ritual.",
    xpReward: 80,
    requirements: [{ label: "Walk 3 mornings", current: 1, target: 3 }],
    parents: ["health-root"],
    unlocks: ["cardio-i"],
    x: 360,
    y: 90
  },
  {
    id: "hydration",
    category: "health",
    title: "Hydration Protocol",
    description: "Stabilize energy by making water automatic.",
    xpReward: 70,
    requirements: [{ label: "Drink water 5 days", current: 2, target: 5 }],
    parents: ["health-root"],
    unlocks: ["strength-training"],
    x: 360,
    y: 250
  },
  {
    id: "cardio-i",
    category: "health",
    title: "Cardio I",
    description: "Unlock basic endurance through repeated sessions.",
    xpReward: 120,
    requirements: [{ label: "Complete 5 workouts", current: 0, target: 5 }],
    parents: ["morning-walk"],
    unlocks: ["athlete"],
    x: 620,
    y: 90
  },
  {
    id: "strength-training",
    category: "health",
    title: "Strength Training",
    description: "Add resistance work as a long-term body upgrade.",
    xpReward: 140,
    requirements: [{ label: "Complete 8 strength sessions", current: 0, target: 8 }],
    parents: ["hydration"],
    unlocks: ["athlete"],
    x: 620,
    y: 250
  },
  {
    id: "athlete",
    category: "health",
    title: "Athlete",
    description: "Combine movement, endurance, and strength into identity.",
    xpReward: 300,
    requirements: [{ label: "Unlock Cardio I and Strength Training", current: 0, target: 2 }],
    parents: ["cardio-i", "strength-training"],
    unlocks: [],
    x: 900,
    y: 170
  },
  {
    id: "business-root",
    category: "business",
    title: "Builder Mindset",
    description: "Start creating assets instead of only consuming information.",
    xpReward: 60,
    requirements: [{ label: "Finish 1 builder mission", current: 0, target: 1 }],
    parents: [],
    unlocks: ["first-project"],
    x: 120,
    y: 500
  },
  {
    id: "first-project",
    category: "business",
    title: "First Project",
    description: "Ship a small project that can be shown to real people.",
    xpReward: 120,
    requirements: [{ label: "Complete 5 project sessions", current: 2, target: 5 }],
    parents: ["business-root"],
    unlocks: ["mvp-launch"],
    x: 380,
    y: 500
  },
  {
    id: "mvp-launch",
    category: "business",
    title: "MVP Launch",
    description: "Publish a minimal product and collect real feedback.",
    xpReward: 220,
    requirements: [{ label: "Launch 1 MVP", current: 0, target: 1 }],
    parents: ["first-project"],
    unlocks: ["first-paying-user", "one-hundred-users"],
    x: 650,
    y: 500
  },
  {
    id: "first-paying-user",
    category: "business",
    title: "First Paying User",
    description: "Validate that someone will pay for what you built.",
    xpReward: 400,
    requirements: [{ label: "Get 1 paid customer", current: 0, target: 1 }],
    parents: ["mvp-launch"],
    unlocks: ["founder"],
    x: 930,
    y: 420
  },
  {
    id: "one-hundred-users",
    category: "business",
    title: "100 Users",
    description: "Prove that the product can attract repeated attention.",
    xpReward: 450,
    requirements: [{ label: "Reach 100 users", current: 0, target: 100 }],
    parents: ["mvp-launch"],
    unlocks: ["founder"],
    x: 930,
    y: 580
  },
  {
    id: "founder",
    category: "business",
    title: "Founder",
    description: "Move from project mode to company-building mode.",
    xpReward: 700,
    requirements: [{ label: "Unlock traction milestones", current: 0, target: 2 }],
    parents: ["first-paying-user", "one-hundred-users"],
    unlocks: [],
    x: 1210,
    y: 500
  }
];
