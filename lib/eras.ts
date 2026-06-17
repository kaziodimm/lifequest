import type { LifeEra } from "./types";

export const lifeEras: { id: LifeEra; title: string; description: string; minLevel: number }[] = [
  {
    id: "foundation",
    title: "Foundation",
    description: "Build the first systems that make life controllable.",
    minLevel: 1
  },
  {
    id: "discipline",
    title: "Discipline",
    description: "Turn repeated action into dependable structure.",
    minLevel: 3
  },
  {
    id: "growth",
    title: "Growth",
    description: "Expand capacity, skills, and opportunity.",
    minLevel: 6
  },
  {
    id: "mastery",
    title: "Mastery",
    description: "Specialize, compound, and raise standards.",
    minLevel: 10
  },
  {
    id: "leadership",
    title: "Leadership",
    description: "Create leverage through people, systems, and influence.",
    minLevel: 15
  },
  {
    id: "legacy",
    title: "Legacy",
    description: "Build things that outlive short-term effort.",
    minLevel: 25
  }
];
