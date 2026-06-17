import type { VisualThemeId } from "./types";

export type VisualTheme = {
  id: VisualThemeId;
  name: string;
  description: string;
  mood: string;
  palette: string[];
  treeBackground: string;
  iconDirection: string;
  availableInMvp: boolean;
};

export const visualThemes: VisualTheme[] = [
  {
    id: "focus-dark",
    name: "Animus Dark",
    description: "The default premium strategy interface: dark open field, golden core, cyan energy lines, and serious adult game UI.",
    mood: "strategic, focused, premium, high contrast",
    palette: ["obsidian", "cyan", "antique gold", "violet signal"],
    treeBackground: "Deep star-map field with subtle grid, animated aura rings, and illuminated branch paths.",
    iconDirection: "Sharp geometric glyphs inspired by strategy tech icons and ancient command symbols.",
    availableInMvp: true
  },
  {
    id: "soft-light",
    name: "Mirage Atlas",
    description: "A lighter historical-map skin for users who prefer warmer visuals without losing the strategic feeling.",
    mood: "warm, precise, exploratory, calm",
    palette: ["parchment", "ink", "lapis", "sunlit gold"],
    treeBackground: "Parchment atlas texture, faint compass geometry, and ink-like connections between nodes.",
    iconDirection: "Etched atlas symbols, compass marks, seals, route markers, and clean artifact icons.",
    availableInMvp: false
  },
  {
    id: "pixel-quest",
    name: "Arcade Codex",
    description: "A collectible game skin for a more playful audience while keeping the product about life progression.",
    mood: "collectible, energetic, retro, readable",
    palette: ["charcoal", "emerald", "amber", "magenta"],
    treeBackground: "Low-noise pixel grid with small animated discovery sparks and chunky node frames.",
    iconDirection: "Readable pixel-style badges for categories, achievements, and unlocked technologies.",
    availableInMvp: false
  },
  {
    id: "cyber-calm",
    name: "Neon Synapse",
    description: "A futuristic neural-network version of the Life Tree for users who like sci-fi progress systems.",
    mood: "futuristic, electric, focused, intelligent",
    palette: ["near black", "electric cyan", "plasma violet", "signal green"],
    treeBackground: "Neural mesh, holographic rings, luminous pulses, and soft scan-line atmosphere.",
    iconDirection: "Minimal neon line icons with circuit, signal, neural, and data motifs.",
    availableInMvp: false
  },
  {
    id: "nature-progress",
    name: "Verdant Relic",
    description: "An organic growth skin where life development feels like cultivating an ancient living tree.",
    mood: "grounded, restorative, mysterious, growth-oriented",
    palette: ["deep moss", "jade", "bone", "ember"],
    treeBackground: "Dark botanical field with root-like connections, faint relic rings, and soft living glow.",
    iconDirection: "Leaf, root, stone, flame, seed, and relic glyphs with premium engraved treatment.",
    availableInMvp: false
  }
];
