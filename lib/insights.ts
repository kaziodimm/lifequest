import { categoryLabels, technologies } from "./life-tree";
import { PlayerState } from "./types";

export function categoryProgress(state: PlayerState) {
  return Object.entries(categoryLabels).map(([category, label]) => {
    const categoryTechs = technologies.filter((tech) => tech.category === category);
    const unlocked = categoryTechs.filter((tech) => state.completedTechnologyIds.includes(tech.id)).length;
    const total = categoryTechs.length;
    const percent = total === 0 ? 0 : Math.round((unlocked / total) * 100);

    return {
      category,
      label,
      unlocked,
      total,
      percent
    };
  });
}

export function availableTechnologies(state: PlayerState) {
  return technologies.filter((tech) => {
    const alreadyUnlocked = state.completedTechnologyIds.includes(tech.id);
    const parentsUnlocked = tech.parents.every((parentId) => state.completedTechnologyIds.includes(parentId));
    return !alreadyUnlocked && parentsUnlocked;
  });
}

export function nextStrategicRecommendation(state: PlayerState) {
  const available = availableTechnologies(state);
  if (available.length === 0) {
    return {
      title: "Create momentum",
      description: "Complete one daily mission to reveal the next strategic upgrade."
    };
  }

  const next = available[0];
  return {
    title: `Research ${next.title}`,
    description: next.description,
    technologyId: next.id
  };
}
