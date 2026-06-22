import type { Locale } from "./types";

export const locales: { id: Locale; label: string }[] = [
  { id: "en", label: "English" },
  { id: "ru", label: "Русский" }
];

const russian: Record<string, string> = {
  "Life Strategy": "Стратегия жизни",
  "Foundation Era": "Эпоха основ",
  Tree: "Дерево",
  Missions: "Миссии",
  Stats: "Статистика",
  Awards: "Награды",
  Profile: "Профиль",
  "Commander Profile": "Профиль стратега",
  "Your profile represents real-life strategic development.": "Ваш профиль отражает реальное развитие вашей жизни.",
  Level: "Уровень",
  "Life Score": "Рейтинг жизни",
  "Unlocked Technologies": "Открытые технологии",
  Achievements: "Достижения",
  "Streak Milestones": "Этапы серии",
  Language: "Язык",
  "Visual Style": "Визуальный стиль",
  active: "активна",
  preview: "предпросмотр",
  locked: "закрыта",
  "Unlock:": "Открывается:",
  "Life Strategy Command": "Командный центр стратегии жизни",
  "Unlock your life, one technology at a time.": "Развивайте свою жизнь — шаг за шагом.",
  "Habidoo is not a todo list. Start missions, respect cooldowns, and turn real effort into Life Tree progress.": "Habidoo — не список дел. Выполняйте миссии и превращайте реальные усилия в развитие Дерева жизни.",
  "Open Life Tree": "Открыть Дерево жизни",
  "Life Tree": "Дерево жизни",
  Streak: "Серия",
  Today: "Сегодня",
  days: "дней",
  "XP to next level": "XP до следующего уровня",
  "technologies unlocked": "технологий открыто",
  "Current Era": "Текущая эпоха",
  "Next unlockable technology": "Следующая доступная технология",
  "Era mastery": "Освоение эпохи",
  "Complete the remaining available branches.": "Завершите оставшиеся доступные ветви.",
  "Active Missions": "Активные миссии",
  "Life mission": "Жизненная миссия",
  Started: "Начато",
  now: "сейчас",
  "No active mission": "Нет активной миссии",
  "Open the Life Tree and start one focused action.": "Откройте Дерево жизни и начните одно конкретное действие.",
  "Strategic Recommendation": "Стратегическая рекомендация",
  "Inspect Tree": "Открыть дерево",
  "Life Domains": "Сферы жизни",
  Intelligence: "Аналитика",
  Statistics: "Статистика",
  "Progress history should show life development, not only task completion.": "История прогресса показывает развитие жизни, а не только выполненные задачи.",
  "7 Day Progress": "Прогресс за 7 дней",
  "Category Growth": "Развитие сфер",
  "of": "из",
  "Progress Archive": "Архив прогресса",
  "Milestones should feel like evidence that your Life Tree is becoming real.": "Достижения показывают, как ваше Дерево жизни становится реальностью.",
  "Built from unlocked technologies and milestone medals.": "Складывается из открытых технологий и наград за этапы.",
  "Milestone Medals": "Награды за этапы",
  "Morning System": "Утренняя система",
  "Daily Command Center": "Дневной командный центр",
  "Top 3 Missions": "Три главные миссии",
  "Every mission should answer: what to do, what technology it progresses, and why it matters.": "Каждая миссия должна объяснять, что делать, какую технологию она развивает и зачем это нужно.",
  "Tiny start:": "Первый шаг:",
  "Progresses:": "Развивает:",
  "Research timer:": "Таймер исследования:",
  ready: "готова",
  completed: "выполнена",
  cooldown: "перезарядка",
  Done: "Готово",
  "24h Planner": "Планировщик на 24 часа",
  "Assign a real-world action": "Назначьте реальное действие",
  Start: "Начать",
  Complete: "Завершить",
  "Active mission": "Активная миссия",
  "Another mission is already active.": "Другая миссия уже активна.",
  "No technology": "Без технологии",
  "The Awakening": "Пробуждение",
  "Chapter 1 / 12 · about 30 days": "Глава 1 / 12 · около 30 дней",
  "Research progress": "Прогресс исследования",
  "Exact steps": "Точные шаги",
  "What do I do now?": "Что делать сейчас?",
  Duration: "Длительность",
  Cooldown: "Перезарядка",
  Personal: "Личная",
  Global: "Общая",
  "Branch mastery": "Освоение ветви",
  "Complete Mission": "Завершить миссию",
  "Start Mission": "Начать миссию",
  "Technology completed": "Технология завершена",
  Research: "Исследование",
  Insight: "Озарение",
  "Future reward": "Будущая награда",
  "What counts": "Что засчитывается",
  "Does not count": "Что не засчитывается",
  "Next unlock": "Следующее открытие",
  "Trial readiness": "Готовность к испытанию",
  "Current readiness requirements met.": "Текущие требования выполнены."
  ,"Body & Energy": "Тело и энергия"
  ,"Focus & Mind": "Фокус и разум"
  ,"Build & Create": "Создание и проекты"
  ,"Direction & Career": "Направление и карьера"
  ,"Money & Freedom": "Деньги и свобода"
  ,"People & Connection": "Люди и отношения"
  ,"Creative Practice": "Творческая практика"
  ,"Strength, sleep and recovery": "Сила, сон и восстановление"
  ,"Clarity, learning and resilience": "Ясность, обучение и устойчивость"
  ,"Turn ideas into useful systems": "Превращение идей в полезные системы"
  ,"Skills, contribution and growth": "Навыки, вклад и рост"
  ,"Stability, choice and resources": "Стабильность, выбор и ресурсы"
  ,"Trust, community and support": "Доверие, окружение и поддержка"
  ,"Expression, play and craft": "Самовыражение, игра и мастерство"
  ,technology: "технология"
  ,milestone: "ключевой этап"
  ,challenge: "испытание"
  ,"Inner Order": "Внутренний порядок"
  ,Momentum: "Импульс"
  ,Stability: "Стабильность"
  ,Focus: "Фокус"
  ,Expansion: "Расширение"
  ,Control: "Контроль"
  ,Confidence: "Уверенность"
  ,Systems: "Системы"
  ,"Mastery Gate": "Врата мастерства"
  ,Ascension: "Восхождение"
  ,"New Horizon": "Новый горизонт"
  ,"1 month": "1 месяц"
  ,Foundation: "Основы"
  ,"Build the first systems that make life controllable.": "Создайте первые системы, которые сделают жизнь управляемой."
  ,Discipline: "Дисциплина"
  ,"Turn repeated action into dependable structure.": "Превратите повторяемые действия в надёжную структуру."
  ,Growth: "Рост"
  ,"Expand capacity, skills, and opportunity.": "Расширяйте возможности, навыки и перспективы."
  ,Mastery: "Мастерство"
  ,"Specialize, compound, and raise standards.": "Углубляйте специализацию и повышайте стандарты."
  ,Leadership: "Лидерство"
  ,"Create leverage through people, systems, and influence.": "Усиливайте результат через людей, системы и влияние."
  ,Legacy: "Наследие"
  ,"Build things that outlive short-term effort.": "Создавайте то, что переживёт краткосрочные усилия."
  ,"Create momentum": "Создайте импульс"
  ,"Complete one daily mission to reveal the next strategic upgrade.": "Выполните одну дневную миссию, чтобы открыть следующее улучшение."
  ,"First Chain": "Первая цепочка"
  ,"The first sign of strategic consistency.": "Первый признак стратегической последовательности."
  ,"Weekly System": "Недельная система"
  ,"One full week of returning to the Life Tree.": "Полная неделя регулярного возвращения к Дереву жизни."
  ,"Momentum Engine": "Двигатель импульса"
  ,"Two weeks of repeated progress.": "Две недели устойчивого прогресса."
  ,"Monthly Doctrine": "Месячная система"
  ,"A month-long operating system for real life.": "Месячная рабочая система для реальной жизни."
  ,"Strategic Identity": "Стратегическая идентичность"
  ,"Consistency has become part of who you are.": "Последовательность стала частью вашей личности."
  ,"Take a 10 minute walk": "Прогуляйтесь 10 минут"
  ,"Put shoes near the door": "Поставьте обувь у двери"
  ,"Work on one project asset": "Поработайте над одним элементом проекта"
  ,"Open the project file": "Откройте файл проекта"
  ,"Drink water before coffee": "Выпейте воду перед кофе"
  ,"Fill one glass": "Наполните один стакан"
  ,"First Command": "Первая команда"
  ,"Complete the first daily mission.": "Выполните первую дневную миссию."
  ,"3 Day Chain": "Серия из трёх дней"
  ,"Reach a 3 day streak.": "Достигните серии в три дня."
  ,"Complete real-world mission": "Выполните реальную миссию"
  ,"Unlock parent technologies first.": "Сначала откройте предыдущие технологии."
  ,"Keep going": "Продолжайте"
  ,"Global cooldown": "Общая перезарядка"
  ,"Branch milestones": "Ключевые этапы ветвей"
  ,future: "позже"
  ,Strategist: "Стратег"
  ,"A focused constellation system for seeing every area of life as one connected trajectory.": "Сосредоточенная система созвездий, объединяющая все сферы жизни в одну траекторию."
  ,"A bright strategic life map built from paper, mineral glass and fine brass.": "Светлая стратегическая карта жизни из бумаги, минерального стекла и латуни."
  ,"A deep systems view for users who want every habit and goal to feel interconnected.": "Глубокий системный вид, связывающий каждую привычку и цель."
  ,"An architectural view of personal development: precise, practical and built step by step.": "Архитектурный взгляд на развитие: точный, практичный и пошаговый."
  ,"A human, restorative system where progress feels organic, balanced and alive.": "Живая восстанавливающая система с естественным и сбалансированным прогрессом."
  ,"Complete The Awakening Trial": "Завершите Испытание Пробуждения"
  ,"Future chapter Trial reward": "Награда за испытание будущей главы"
  ,standard: "стандартная"
  ,micro: "короткая"
  ,deep: "глубокая"
  ,Badge: "Значок"
  ,Title: "Титул"
  ,Theme: "Тема"
  ,"Cosmetic reward slot prepared": "Место для косметической награды подготовлено"
  ,"Life Core": "Ядро жизни"
};

export function translate(locale: Locale, text: string) {
  return locale === "ru" ? russian[text] ?? text : text;
}

export function translateDynamic(locale: Locale, text: string) {
  if (locale !== "ru") return text;
  const exact = russian[text];
  if (exact) return exact;
  let match = text.match(/^Complete (\d+) more required parent missions?\.$/);
  if (match) return `Завершите ещё ${match[1]} обязательных предыдущих миссий.`;
  match = text.match(/^Reach level (\d+)\.$/);
  if (match) return `Достигните уровня ${match[1]}.`;
  match = text.match(/^Earn (\d+) more Insight Points\.$/);
  if (match) return `Получите ещё ${match[1]} очков озарения.`;
  match = text.match(/^Complete (\d+) more (\w+) branch nodes?\.$/);
  if (match) return `Завершите ещё ${match[1]} узлов ветви «${translate(locale, categoryName(match[2]))}».`;
  match = text.match(/^Complete (\d+) more branch milestones?\.$/);
  if (match) return `Завершите ещё ${match[1]} ключевых этапов ветвей.`;
  return text;
}

function categoryName(category: string) {
  return ({ health: "Body & Energy", mind: "Focus & Mind", business: "Build & Create", career: "Direction & Career", finance: "Money & Freedom", relationships: "People & Connection", creativity: "Creative Practice" } as Record<string, string>)[category] ?? category;
}

export const copy = {
  en: { product: "Habidoo", category: "Life Strategy", tree: "Life Technology Tree", command: "Daily Command Center" },
  ru: { product: "Habidoo", category: "Стратегия жизни", tree: "Дерево жизненных технологий", command: "Дневной командный центр" }
} satisfies Record<Locale, Record<string, string>>;
