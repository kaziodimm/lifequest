export type TreeThemeId = "orbit" | "atlas" | "nexus" | "blueprint" | "pulse";

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
    id: "orbit",
    title: "Orbit",
    shortTitle: "Orbit",
    description: "A focused constellation system for seeing every area of life as one connected trajectory.",
    mood: "Focused, intelligent, premium, calm.",
    background: "Graphite orbital field with restrained cyan and amber navigation light.",
    nodeLanguage: "Brushed-metal research emblems with smoked-glass centers.",
    iconLanguage: "Dimensional branch symbols with precise color coding.",
    connectionLanguage: "Clean orbital branches with visible milestones and quiet locked paths.",
    palette: { base: "#07111d", surface: "#101c29", primary: "#67dcd2", secondary: "#8c7cf1", accent: "#e7ae56", danger: "#e96c83" }
  },
  {
    id: "atlas",
    title: "Atlas",
    shortTitle: "Atlas",
    description: "A bright strategic life map built from paper, mineral glass and fine brass.",
    mood: "Clear, exploratory, warm, considered.",
    background: "Ivory cartography with subtle topography and mineral-blue overlays.",
    nodeLanguage: "Ivory enamel seals with brass rims and map-like engraving.",
    iconLanguage: "Elegant research symbols with blue glass inlays.",
    connectionLanguage: "Cartographic routes with brass milestones and readable progress.",
    palette: { base: "#eee8da", surface: "#f8f3e8", primary: "#2d8792", secondary: "#5a7892", accent: "#b88a37", danger: "#b65e62" }
  },
  {
    id: "nexus",
    title: "Nexus",
    shortTitle: "Nexus",
    description: "A deep systems view for users who want every habit and goal to feel interconnected.",
    mood: "Technical, analytical, deep, controlled.",
    background: "Optical blue system field with concentric clusters and precision detail.",
    nodeLanguage: "Smoked-glass modules with anodized rims and internal light.",
    iconLanguage: "High-contrast optical symbols with restrained branch color.",
    connectionLanguage: "Signal routes with clustered hubs and precise active states.",
    palette: { base: "#061329", surface: "#0b1d38", primary: "#4fc9f3", secondary: "#9874ed", accent: "#e4b75d", danger: "#ef688c" }
  },
  {
    id: "blueprint",
    title: "Blueprint",
    shortTitle: "Plan",
    description: "An architectural view of personal development: precise, practical and built step by step.",
    mood: "Purposeful, structured, mature, productive.",
    background: "Blueprint paper with construction geometry and amber registration points.",
    nodeLanguage: "Drafting medallions with frosted acrylic and engraved measurements.",
    iconLanguage: "Clean technical symbols drawn as dimensional plans.",
    connectionLanguage: "Construction lines with checkpoints, joints and clear dependencies.",
    palette: { base: "#0b3562", surface: "#124579", primary: "#73d8ff", secondary: "#dcecff", accent: "#f2a93b", danger: "#f16e71" }
  },
  {
    id: "pulse",
    title: "Pulse",
    shortTitle: "Pulse",
    description: "A human, restorative system where progress feels organic, balanced and alive.",
    mood: "Fresh, warm, restorative, optimistic.",
    background: "Pearl biomaterials, water-like glass and soft living color.",
    nodeLanguage: "Translucent bio-glass emblems with soft mineral rims.",
    iconLanguage: "Organic dimensional symbols with gentle branch color.",
    connectionLanguage: "Fluid growth paths with soft milestones and calm progress states.",
    palette: { base: "#eee9df", surface: "#faf7f0", primary: "#319c94", secondary: "#9a82b3", accent: "#e58d72", danger: "#d76571" }
  }
];

export const defaultTreeThemeId: TreeThemeId = "orbit";
