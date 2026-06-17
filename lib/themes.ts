import type { VisualThemeId } from "./types";

export type VisualTheme = {
  id: VisualThemeId;
  name: string;
  description: string;
  mood: string;
  availableInMvp: boolean;
};

export const visualThemes: VisualTheme[] = [
  {
    id: "focus-dark",
    name: "Focus Dark",
    description: "Premium dark strategy UI with cyan energy and deep panels.",
    mood: "strategic, focused, high contrast",
    availableInMvp: true
  },
  {
    id: "soft-light",
    name: "Soft Light",
    description: "A calmer light mode for users who want less intensity.",
    mood: "calm, clear, friendly",
    availableInMvp: false
  },
  {
    id: "pixel-quest",
    name: "Pixel Quest",
    description: "A future retro strategy layer for more game-like progression.",
    mood: "playful, collectible, nostalgic",
    availableInMvp: false
  },
  {
    id: "cyber-calm",
    name: "Cyber Calm",
    description: "A futuristic night interface with controlled neon energy.",
    mood: "futuristic, focused, premium",
    availableInMvp: false
  },
  {
    id: "nature-progress",
    name: "Nature Progress",
    description: "A growth-oriented theme for recovery, balance, and consistency.",
    mood: "organic, restorative, warm",
    availableInMvp: false
  }
];
