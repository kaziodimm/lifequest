export type TreeThemeId = "animus-dark" | "mirage-atlas" | "arcade-codex" | "neon-synapse" | "verdant-relic";

export type TreeTheme = {
  id: TreeThemeId;
  title: string;
  shortTitle: string;
  description: string;
  mood: string;
  background: string;
  nodeLanguage: string;
  iconLanguage: string;
  connectionLanguage: string;
  palette: {
    base: string;
    surface: string;
    primary: string;
    secondary: string;
    accent: string;
    danger: string;
  };
};

export const treeThemes: TreeTheme[] = [
  {
    id: "animus-dark",
    title: "Animus Dark",
    shortTitle: "Animus",
    description: "The default Habidoo identity: an obsidian constellation research map for ambitious adults.",
    mood: "Premium, strategic, mysterious, focused.",
    background: "Deep cosmic field, astrolabe rings, cyan-violet fog, antique gold core aura.",
    nodeLanguage: "Forged hex medallions with inner research rings and restrained glow.",
    iconLanguage: "Sharp geometric artifact glyphs with category-colored energy.",
    connectionLanguage: "Constellation branches with luminous joints and dim locked paths.",
    palette: {
      base: "#050711",
      surface: "#101827",
      primary: "#4ce0d2",
      secondary: "#9b7cff",
      accent: "#f6c453",
      danger: "#ff6b8f"
    }
  },
  {
    id: "mirage-atlas",
    title: "Mirage Atlas",
    shortTitle: "Atlas",
    description: "A warm strategic-map theme that feels like researching life through a living expedition chart.",
    mood: "Historical, calm, premium, exploratory.",
    background: "Dark parchment atlas, subtle compass geometry, lapis shadows, warm ink gradients.",
    nodeLanguage: "Etched brass seals, compass ticks, map-marker gates, soft worn edges.",
    iconLanguage: "Engraved artifact symbols with ink-line detail and metal highlights.",
    connectionLanguage: "Cartographic routes, inked branch roads, glowing milestone pins.",
    palette: {
      base: "#120f0a",
      surface: "#211a12",
      primary: "#2f9fbb",
      secondary: "#4056a1",
      accent: "#d6a84f",
      danger: "#b85c5c"
    }
  },
  {
    id: "arcade-codex",
    title: "Arcade Codex",
    shortTitle: "Codex",
    description: "A more collectible game style with strong reward readability and retro-future charm.",
    mood: "Energetic, collectible, readable, playful but not childish.",
    background: "Dark pixel-grid codex board, subtle scan texture, emerald and magenta reward glints.",
    nodeLanguage: "Chunky beveled badges, crisp silhouettes, achievement-like milestone frames.",
    iconLanguage: "Compact pixel-inspired glyphs with modern anti-aliased polish.",
    connectionLanguage: "Segmented power lines, charged checkpoints, reward-path pulses.",
    palette: {
      base: "#07090f",
      surface: "#15151f",
      primary: "#3cff9a",
      secondary: "#ff4fd8",
      accent: "#ffd34d",
      danger: "#ff5c7a"
    }
  },
  {
    id: "neon-synapse",
    title: "Neon Synapse",
    shortTitle: "Synapse",
    description: "A sci-fi neural strategy theme for users who want their Life Tree to feel like a living intelligence system.",
    mood: "Futuristic, sharp, fast, analytical.",
    background: "Holographic mesh field, circuit fog, plasma violet depth, cyan scan glow.",
    nodeLanguage: "Glass neural chips, circuit gates, bright active-state outlines.",
    iconLanguage: "Circuit-neural glyphs with precise angled cuts and scan-line highlights.",
    connectionLanguage: "Electric traces, signal pulses, animated data flow along active branches.",
    palette: {
      base: "#030711",
      surface: "#0b1324",
      primary: "#00f0ff",
      secondary: "#a855f7",
      accent: "#7cffd4",
      danger: "#ff3d81"
    }
  },
  {
    id: "verdant-relic",
    title: "Verdant Relic",
    shortTitle: "Relic",
    description: "An ancient organic strategy theme where progression feels like awakening a living relic tree.",
    mood: "Organic, ancient, grounded, ritualistic.",
    background: "Dark botanical field, root shadows, jade mist, ember relic light.",
    nodeLanguage: "Seed relics, stone-jade frames, growth rings, slow living glow.",
    iconLanguage: "Relic glyphs carved from leaf, ember, seed, and stone shapes.",
    connectionLanguage: "Root-like research branches, sap-glow progress, dim dormant paths.",
    palette: {
      base: "#06100b",
      surface: "#101a13",
      primary: "#4ade80",
      secondary: "#16a085",
      accent: "#f59e0b",
      danger: "#ef6666"
    }
  }
];

export const defaultTreeThemeId: TreeThemeId = "animus-dark";
