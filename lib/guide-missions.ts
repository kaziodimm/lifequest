import type { GuideMissionDefinition, LifeCategory, MissionAnswer } from "./types";
import { validateMissionAnswers } from "./mission-rules.ts";

export const guideMissions: GuideMissionDefinition[] = [
  {
    id: "guide-health",
    category: "health",
    rootTechnologyId: "health-root",
    title: "Body & Energy",
    shortAction: "Water, breath, 60-second neck or shoulder stretch.",
    actionTitle: "Activate your body with one real reset",
    concreteOutcome: "You stood up, drank water, breathed slowly and stretched for 60 seconds.",
    exampleResult: "Neck feels less locked after sitting.",
    reward: { research: 10 },
    inputSchema: [
      { id: "done", type: "confirmation", label: "I stood up, drank water and stretched neck or shoulders for 60 seconds.", required: true },
      { id: "body-signal", type: "shortText", label: "What did you notice in your body?", placeholder: "For example: neck is tight but warmer", required: true }
    ]
  },
  {
    id: "guide-mind",
    category: "mind",
    rootTechnologyId: "mind-root",
    title: "Focus & Mind",
    shortAction: "Close one distraction and choose a 5-minute physical action.",
    actionTitle: "Clear one distraction and aim your next 5 minutes",
    concreteOutcome: "One distracting tab/app/surface is cleared and one concrete next action is saved.",
    exampleResult: "Closed social tab; next: open document and write first paragraph.",
    reward: { research: 10 },
    inputSchema: [
      { id: "cleared", type: "confirmation", label: "I closed or cleared one visible distraction.", required: true },
      { id: "next-action", type: "shortText", label: "What exact action will you do for 5 minutes?", placeholder: "Open… / Write… / Send…", required: true }
    ]
  },
  {
    id: "guide-finance",
    category: "finance",
    rootTechnologyId: "finance-root",
    title: "Money & Freedom",
    shortAction: "Open a money source and record one simple fact.",
    actionTitle: "Capture one money fact without analysis",
    concreteOutcome: "Bank app, notes or spreadsheet opened; one balance, expense, subscription or payment was noted.",
    exampleResult: "Found one subscription renewal due Friday.",
    reward: { research: 10 },
    inputSchema: [
      { id: "opened", type: "confirmation", label: "I opened a bank app, notes or spreadsheet.", required: true },
      { id: "money-fact", type: "shortText", label: "What one simple money fact did you record?", placeholder: "Balance, expense, subscription or next payment", required: true }
    ]
  },
  {
    id: "guide-business",
    category: "business",
    rootTechnologyId: "business-root",
    title: "Build & Create",
    shortAction: "Open your project and make one tiny visible artifact.",
    actionTitle: "Create the first visible project artifact",
    concreteOutcome: "A real project was opened and one list, screen, note, draft or file now exists.",
    exampleResult: "Project: Habidoo. Artifact: first onboarding checklist.",
    reward: { research: 10 },
    inputSchema: [
      { id: "project-name", type: "shortText", label: "Project name", placeholder: "Your real project name", required: true },
      { id: "artifact", type: "shortText", label: "What tiny visible artifact exists now?", placeholder: "List, screen, note, draft or file", required: true }
    ]
  },
  {
    id: "guide-career",
    category: "career",
    rootTechnologyId: "career-root",
    title: "Direction & Career",
    shortAction: "Save one role, skill, CV line or portfolio item.",
    actionTitle: "Save one real career signal",
    concreteOutcome: "One real opportunity, skill, CV/profile line or portfolio item is saved.",
    exampleResult: "Saved frontend role; updated one portfolio bullet.",
    reward: { research: 10 },
    inputSchema: [
      { id: "career-direction", type: "shortText", label: "What direction is this connected to?", placeholder: "Role, skill or career direction", required: true },
      { id: "saved-item", type: "shortText", label: "What did you save or update?", placeholder: "Vacancy, skill, CV line or portfolio item", required: true }
    ]
  },
  {
    id: "guide-relationships",
    category: "relationships",
    rootTechnologyId: "relationships-root",
    title: "People & Connection",
    shortAction: "Send or prepare one meaningful message.",
    actionTitle: "Make one real connection move",
    concreteOutcome: "A real person, message context and next step are saved.",
    exampleResult: "Anna — drafted a check-in; next: send after work.",
    reward: { research: 10 },
    inputSchema: [
      { id: "person", type: "shortText", label: "Person or context", placeholder: "Name or relationship context", required: true },
      { id: "next-step", type: "shortText", label: "What message action did you take and what is next?", placeholder: "Sent / drafted / next step", required: true }
    ]
  },
  {
    id: "guide-creativity",
    category: "creativity",
    rootTechnologyId: "creativity-root",
    title: "Creative Practice",
    shortAction: "Create a rough visible draft for 10 minutes.",
    actionTitle: "Make one rough creative artifact",
    concreteOutcome: "A text, sketch, photo, video, melody or note exists now.",
    exampleResult: "Rough paragraph saved in notes.",
    reward: { research: 10 },
    inputSchema: [
      { id: "draft-done", type: "confirmation", label: "I created and saved a rough 10-minute draft.", required: true },
      { id: "draft-result", type: "shortText", label: "What visible artifact exists now?", placeholder: "Paragraph, sketch, photo, clip, melody or note", required: true }
    ]
  }
];

export function getGuideMission(id: string | undefined) {
  return guideMissions.find((mission) => mission.id === id);
}

export function getGuideMissionByCategory(category: LifeCategory | undefined) {
  return guideMissions.find((mission) => mission.category === category);
}

export function getCompletedGuideMission(state: { guideMissionSelectedId?: string; guideMissionCompletedIds?: string[] }) {
  const selected = getGuideMission(state.guideMissionSelectedId);
  return selected && state.guideMissionCompletedIds?.includes(selected.id) ? selected : undefined;
}

export function getRecommendedRootTechnologyIdAfterGuide(state: { guideMissionSelectedId?: string; guideMissionCompletedIds?: string[] }) {
  return getCompletedGuideMission(state)?.rootTechnologyId;
}

export function canCompleteGuideMission(definition: GuideMissionDefinition | undefined, answers: Record<string, MissionAnswer> | undefined) {
  if (!definition) return false;
  return validateMissionAnswers({ ...definition, minimumDurationSeconds: 0, technologyId: definition.rootTechnologyId } as never, answers ?? {}).valid;
}

const guideTranslations: Partial<Record<string, Record<string, Partial<GuideMissionDefinition> & { inputs?: Record<string, { label: string; placeholder?: string }> }>>> = {
  ru: {
    "guide-health": { title: "Body & Energy", shortAction: "Вода, дыхание и 60 секунд растяжки шеи или плеч.", actionTitle: "Активируйте тело одним реальным сбросом", concreteOutcome: "Вы встали, выпили воды, медленно подышали и растянулись 60 секунд.", exampleResult: "Шея стала менее зажатой после сидения.", inputs: { done: { label: "Я встал, выпил воды и растянул шею или плечи 60 секунд." }, "body-signal": { label: "Что вы заметили в теле?", placeholder: "Например: шея напряжена, но стала теплее" } } },
    "guide-mind": { title: "Focus & Mind", shortAction: "Закройте одну помеху и выберите физическое действие на 5 минут.", actionTitle: "Уберите одну помеху и направьте следующие 5 минут", concreteOutcome: "Одна вкладка/приложение/поверхность очищена, конкретное следующее действие сохранено.", exampleResult: "Закрыл соцсеть; дальше: открыть документ и написать первый абзац.", inputs: { cleared: { label: "Я закрыл или убрал одну видимую помеху." }, "next-action": { label: "Какое точное действие вы сделаете 5 минут?", placeholder: "Открыть… / Написать… / Отправить…" } } },
    "guide-finance": { title: "Money & Freedom", shortAction: "Откройте денежный источник и запишите один простой факт.", actionTitle: "Зафиксируйте один денежный факт без анализа", concreteOutcome: "Банк, заметки или таблица открыты; один баланс, расход, подписка или платёж записан.", exampleResult: "Нашёл продление подписки в пятницу.", inputs: { opened: { label: "Я открыл банк, заметки или таблицу." }, "money-fact": { label: "Какой один простой денежный факт вы записали?", placeholder: "Баланс, расход, подписка или ближайший платёж" } } },
    "guide-business": { title: "Build & Create", shortAction: "Откройте свой проект и сделайте маленький видимый артефакт.", actionTitle: "Создайте первый видимый артефакт проекта", concreteOutcome: "Реальный проект открыт, и теперь существует список, экран, заметка, черновик или файл.", exampleResult: "Проект: Habidoo. Артефакт: первый чеклист onboarding.", inputs: { "project-name": { label: "Название проекта", placeholder: "Название вашего реального проекта" }, artifact: { label: "Какой маленький видимый артефакт существует сейчас?", placeholder: "Список, экран, заметка, черновик или файл" } } },
    "guide-career": { title: "Direction & Career", shortAction: "Сохраните роль, навык, строку CV или элемент портфолио.", actionTitle: "Сохраните один реальный карьерный сигнал", concreteOutcome: "Одна реальная возможность, навык, строка профиля/CV или портфолио сохранены.", exampleResult: "Сохранена frontend-вакансия; обновлён один пункт портфолио.", inputs: { "career-direction": { label: "С каким направлением это связано?", placeholder: "Роль, навык или карьерное направление" }, "saved-item": { label: "Что вы сохранили или обновили?", placeholder: "Вакансия, навык, строка CV или портфолио" } } },
    "guide-relationships": { title: "People & Connection", shortAction: "Отправьте или подготовьте одно содержательное сообщение.", actionTitle: "Сделайте один реальный шаг связи", concreteOutcome: "Реальный человек, контекст сообщения и следующий шаг сохранены.", exampleResult: "Анна — подготовлен check-in; дальше: отправить после работы.", inputs: { person: { label: "Человек или контекст", placeholder: "Имя или контекст отношений" }, "next-step": { label: "Что вы сделали с сообщением и что дальше?", placeholder: "Отправил / подготовил / следующий шаг" } } },
    "guide-creativity": { title: "Creative Practice", shortAction: "Создайте грубый видимый черновик за 10 минут.", actionTitle: "Сделайте один грубый творческий артефакт", concreteOutcome: "Текст, набросок, фото, видео, мелодия или заметка уже существует.", exampleResult: "Грубый абзац сохранён в заметках.", inputs: { "draft-done": { label: "Я создал и сохранил грубый 10-минутный черновик." }, "draft-result": { label: "Какой видимый артефакт существует сейчас?", placeholder: "Абзац, скетч, фото, клип, мелодия или заметка" } } }
  },
  cs: {
    "guide-health": { shortAction: "Voda, dech a 60 sekund protažení krku nebo ramen.", actionTitle: "Aktivujte tělo jedním skutečným resetem", concreteOutcome: "Postavili jste se, napili vody, pomalu dýchali a 60 sekund se protáhli.", exampleResult: "Krk je po sezení méně ztuhlý.", inputs: { done: { label: "Postavil/a jsem se, napil/a vody a 60 sekund protáhl/a krk nebo ramena." }, "body-signal": { label: "Čeho jste si v těle všimli?", placeholder: "Například: krk je ztuhlý, ale teplejší" } } },
    "guide-mind": { shortAction: "Zavřete jedno vyrušení a zvolte fyzickou akci na 5 minut.", actionTitle: "Odstraňte jedno vyrušení a zaměřte dalších 5 minut", concreteOutcome: "Jedna karta/aplikace/plocha je uklizená a konkrétní další akce je uložená.", exampleResult: "Zavřená sociální karta; dál otevřít dokument a napsat první odstavec.", inputs: { cleared: { label: "Zavřel/a nebo uklidil/a jsem jedno viditelné vyrušení." }, "next-action": { label: "Jakou přesnou akci uděláte 5 minut?", placeholder: "Otevřít… / Napsat… / Odeslat…" } } },
    "guide-finance": { shortAction: "Otevřete finanční zdroj a zapište jeden jednoduchý fakt.", actionTitle: "Zachyťte jeden finanční fakt bez analýzy", concreteOutcome: "Banka, poznámky nebo tabulka jsou otevřené; jeden zůstatek, výdaj, předplatné nebo platba je zapsaná.", exampleResult: "Nalezeno obnovení předplatného v pátek.", inputs: { opened: { label: "Otevřel/a jsem banku, poznámky nebo tabulku." }, "money-fact": { label: "Jaký jeden jednoduchý finanční fakt jste zapsali?", placeholder: "Zůstatek, výdaj, předplatné nebo nejbližší platba" } } },
    "guide-business": { shortAction: "Otevřete svůj projekt a vytvořte malý viditelný artefakt.", actionTitle: "Vytvořte první viditelný artefakt projektu", concreteOutcome: "Skutečný projekt je otevřený a existuje seznam, obrazovka, poznámka, návrh nebo soubor.", exampleResult: "Projekt: Habidoo. Artefakt: první onboarding checklist.", inputs: { "project-name": { label: "Název projektu", placeholder: "Název vašeho skutečného projektu" }, artifact: { label: "Jaký malý viditelný artefakt teď existuje?", placeholder: "Seznam, obrazovka, poznámka, návrh nebo soubor" } } },
    "guide-career": { shortAction: "Uložte jednu roli, dovednost, řádek CV nebo položku portfolia.", actionTitle: "Uložte jeden skutečný kariérní signál", concreteOutcome: "Jedna skutečná příležitost, dovednost, řádek CV/profilu nebo položka portfolia je uložená.", exampleResult: "Uložená frontend role; upravený jeden bod portfolia.", inputs: { "career-direction": { label: "S jakým směrem to souvisí?", placeholder: "Role, dovednost nebo kariérní směr" }, "saved-item": { label: "Co jste uložili nebo upravili?", placeholder: "Pozice, dovednost, řádek CV nebo portfolio" } } },
    "guide-relationships": { shortAction: "Pošlete nebo připravte jednu smysluplnou zprávu.", actionTitle: "Udělejte jeden skutečný krok spojení", concreteOutcome: "Skutečný člověk, kontext zprávy a další krok jsou uložené.", exampleResult: "Anna — připravený check-in; dál poslat po práci.", inputs: { person: { label: "Člověk nebo kontext", placeholder: "Jméno nebo vztahový kontext" }, "next-step": { label: "Co jste se zprávou udělali a co dál?", placeholder: "Odesláno / připraveno / další krok" } } },
    "guide-creativity": { shortAction: "Vytvořte hrubý viditelný návrh za 10 minut.", actionTitle: "Vytvořte jeden hrubý tvůrčí artefakt", concreteOutcome: "Text, skica, fotka, video, melodie nebo poznámka už existuje.", exampleResult: "Hrubý odstavec uložený v poznámkách.", inputs: { "draft-done": { label: "Vytvořil/a a uložil/a jsem hrubý desetiminutový návrh." }, "draft-result": { label: "Jaký viditelný artefakt teď existuje?", placeholder: "Odstavec, skica, fotka, klip, melodie nebo poznámka" } } }
  },
  uk: {
    "guide-health": { shortAction: "Вода, дихання і 60 секунд розтяжки шиї або плечей.", actionTitle: "Активуйте тіло одним реальним перезапуском", concreteOutcome: "Ви встали, випили води, повільно подихали і розтягнулися 60 секунд.", exampleResult: "Шия стала менш затиснутою після сидіння.", inputs: { done: { label: "Я встав, випив води і розтягнув шию або плечі 60 секунд." }, "body-signal": { label: "Що ви помітили в тілі?", placeholder: "Наприклад: шия напружена, але стала теплішою" } } },
    "guide-mind": { shortAction: "Закрийте одну перешкоду і виберіть фізичну дію на 5 хвилин.", actionTitle: "Приберіть одну перешкоду і спрямуйте наступні 5 хвилин", concreteOutcome: "Одна вкладка/програма/поверхня очищена, конкретна наступна дія збережена.", exampleResult: "Закрив соцмережу; далі: відкрити документ і написати перший абзац.", inputs: { cleared: { label: "Я закрив або прибрав одну видиму перешкоду." }, "next-action": { label: "Яку точну дію ви зробите 5 хвилин?", placeholder: "Відкрити… / Написати… / Надіслати…" } } },
    "guide-finance": { shortAction: "Відкрийте грошове джерело і запишіть один простий факт.", actionTitle: "Зафіксуйте один грошовий факт без аналізу", concreteOutcome: "Банк, нотатки або таблиця відкриті; один баланс, витрата, підписка або платіж записані.", exampleResult: "Знайдено поновлення підписки у пʼятницю.", inputs: { opened: { label: "Я відкрив банк, нотатки або таблицю." }, "money-fact": { label: "Який один простий грошовий факт ви записали?", placeholder: "Баланс, витрата, підписка або найближчий платіж" } } },
    "guide-business": { shortAction: "Відкрийте свій проєкт і створіть маленький видимий артефакт.", actionTitle: "Створіть перший видимий артефакт проєкту", concreteOutcome: "Реальний проєкт відкритий, і вже існує список, екран, нотатка, чернетка або файл.", exampleResult: "Проєкт: Habidoo. Артефакт: перший onboarding checklist.", inputs: { "project-name": { label: "Назва проєкту", placeholder: "Назва вашого реального проєкту" }, artifact: { label: "Який маленький видимий артефакт існує зараз?", placeholder: "Список, екран, нотатка, чернетка або файл" } } },
    "guide-career": { shortAction: "Збережіть роль, навичку, рядок CV або елемент портфоліо.", actionTitle: "Збережіть один реальний карʼєрний сигнал", concreteOutcome: "Одна реальна можливість, навичка, рядок CV/профілю або елемент портфоліо збережені.", exampleResult: "Збережена frontend-вакансія; оновлено один пункт портфоліо.", inputs: { "career-direction": { label: "З яким напрямом це повʼязано?", placeholder: "Роль, навичка або карʼєрний напрям" }, "saved-item": { label: "Що ви зберегли або оновили?", placeholder: "Вакансія, навичка, рядок CV або портфоліо" } } },
    "guide-relationships": { shortAction: "Надішліть або підготуйте одне змістовне повідомлення.", actionTitle: "Зробіть один реальний крок звʼязку", concreteOutcome: "Реальна людина, контекст повідомлення і наступний крок збережені.", exampleResult: "Анна — підготовлений check-in; далі: надіслати після роботи.", inputs: { person: { label: "Людина або контекст", placeholder: "Імʼя або контекст стосунків" }, "next-step": { label: "Що ви зробили з повідомленням і що далі?", placeholder: "Надіслав / підготував / наступний крок" } } },
    "guide-creativity": { shortAction: "Створіть грубу видиму чернетку за 10 хвилин.", actionTitle: "Зробіть один грубий творчий артефакт", concreteOutcome: "Текст, ескіз, фото, відео, мелодія або нотатка вже існує.", exampleResult: "Грубий абзац збережено в нотатках.", inputs: { "draft-done": { label: "Я створив і зберіг грубу 10-хвилинну чернетку." }, "draft-result": { label: "Який видимий артефакт існує зараз?", placeholder: "Абзац, ескіз, фото, кліп, мелодія або нотатка" } } }
  }
};

export function localizeGuideMission(definition: GuideMissionDefinition, locale: string): GuideMissionDefinition {
  const translation = guideTranslations[locale]?.[definition.id];
  if (!translation) return definition;
  return {
    ...definition,
    ...translation,
    inputSchema: definition.inputSchema.map((input) => ({ ...input, ...(translation.inputs?.[input.id] ?? {}) }))
  };
}
