import type { Locale } from "./types";

export const locales: { id: Locale; label: string }[] = [
  { id: "en", label: "English" },
  { id: "cs", label: "Cestina" },
  { id: "ru", label: "Русский" },
  { id: "uk", label: "Українська" }
];

export const copy = {
  en: {
    product: "Habidoo",
    category: "Life Strategy",
    tree: "Life Technology Tree",
    command: "Daily Command Center"
  },
  cs: {
    product: "Habidoo",
    category: "Zivotni strategie",
    tree: "Strom zivotnich technologii",
    command: "Denni velitelske centrum"
  },
  ru: {
    product: "Habidoo",
    category: "Стратегия жизни",
    tree: "Дерево жизненных технологий",
    command: "Дневной командный центр"
  },
  uk: {
    product: "Habidoo",
    category: "Стратегія життя",
    tree: "Дерево життєвих технологій",
    command: "Денний командний центр"
  }
} satisfies Record<Locale, Record<string, string>>;
