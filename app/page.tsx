"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Check, GitBranch, Lock, ShieldCheck, Sparkles, Target, Trophy } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { CloudAccountPanel } from "@/components/cloud-account-panel";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthState } from "@/lib/auth-state";
import { locales } from "@/lib/i18n";
import { categoryColors } from "@/lib/life-tree";
import { useLifeStore } from "@/lib/store";
import type { FocusObjectType, LifeCategory, Locale } from "@/lib/types";
import { cn } from "@/lib/utils";

const categoryNames: Record<Locale, Record<LifeCategory, string>> = {
  en: { health: "Body & Energy", mind: "Focus & Mind", finance: "Money & Freedom", business: "Build & Create", career: "Direction & Career", relationships: "People & Connection", creativity: "Creative Practice" },
  ru: { health: "Тело и энергия", mind: "Фокус и разум", finance: "Деньги и свобода", business: "Создание и проекты", career: "Направление и карьера", relationships: "Люди и отношения", creativity: "Творческая практика" },
  cs: { health: "Tělo a energie", mind: "Soustředění a mysl", finance: "Peníze a svoboda", business: "Tvorba a projekty", career: "Směr a kariéra", relationships: "Lidé a vztahy", creativity: "Tvůrčí praxe" },
  uk: { health: "Тіло й енергія", mind: "Фокус і розум", finance: "Гроші й свобода", business: "Створення і проєкти", career: "Напрям і кар’єра", relationships: "Люди й стосунки", creativity: "Творча практика" }
};

const focusSuggestions: Record<Locale, Record<LifeCategory, string[]>> = {
  en: { health: ["Morning energy", "Sleep routine", "Daily movement"], mind: ["Current priority", "Learning topic", "Focus routine"], finance: ["Monthly clarity", "First safety buffer", "Spending control"], business: ["Website or app", "Work process", "Service idea"], career: ["Proof of skill", "Professional profile", "Role-relevant skill"], relationships: ["Important person", "Family connection", "Friendship"], creativity: ["Writing", "Drawing or design", "Photo or video"] },
  ru: { health: ["Утренняя энергия", "Режим сна", "Ежедневное движение"], mind: ["Текущий приоритет", "Тема обучения", "Режим фокуса"], finance: ["Ясность бюджета", "Первый резерв", "Контроль расходов"], business: ["Сайт или приложение", "Рабочий процесс", "Идея услуги"], career: ["Доказательство навыка", "Профессиональный профиль", "Полезный для роли навык"], relationships: ["Важный человек", "Связь с семьёй", "Дружеские отношения"], creativity: ["Текст", "Рисунок или дизайн", "Фото или видео"] },
  cs: { health: ["Ranní energie", "Spánkový režim", "Denní pohyb"], mind: ["Současná priorita", "Téma učení", "Režim soustředění"], finance: ["Přehled rozpočtu", "První rezerva", "Kontrola výdajů"], business: ["Web nebo aplikace", "Pracovní proces", "Nápad na službu"], career: ["Důkaz dovednosti", "Profesní profil", "Dovednost pro roli"], relationships: ["Důležitý člověk", "Rodinný vztah", "Přátelství"], creativity: ["Psaní", "Kresba nebo design", "Foto nebo video"] },
  uk: { health: ["Ранкова енергія", "Режим сну", "Щоденний рух"], mind: ["Поточний пріоритет", "Тема навчання", "Режим фокусу"], finance: ["Ясність бюджету", "Перший резерв", "Контроль витрат"], business: ["Сайт або застосунок", "Робочий процес", "Ідея послуги"], career: ["Доказ навички", "Професійний профіль", "Корисна для ролі навичка"], relationships: ["Важлива людина", "Зв’язок із родиною", "Дружні стосунки"], creativity: ["Текст", "Малюнок або дизайн", "Фото або відео"] }
};

const onboardingCopy: Record<Locale, { eyebrow: string; title: string; intro: string; language: string; category: string; focus: string; next: string; enter: string; other: string }> = {
  en: { eyebrow: "Life Strategy Game", title: "Choose one path. Start one real mission.", intro: "Habidoo turns real action into visible Life Tree progress.", language: "Choose language", category: "Which area should improve first?", focus: "What should this chapter focus on?", next: "Continue", enter: "Enter the Life Tree", other: "Your own focus" },
  ru: { eyebrow: "Стратегическая игра жизни", title: "Выберите путь. Начните одну реальную миссию.", intro: "Habidoo превращает реальные действия в видимый прогресс Дерева жизни.", language: "Выберите язык", category: "Какую сферу улучшить первой?", focus: "На чём сосредоточиться в этой главе?", next: "Продолжить", enter: "Перейти в Дерево жизни", other: "Свой объект фокуса" },
  cs: { eyebrow: "Strategická hra života", title: "Zvolte cestu. Začněte jednu skutečnou misi.", intro: "Habidoo mění skutečné kroky na viditelný postup ve Stromu života.", language: "Zvolte jazyk", category: "Která oblast se má zlepšit jako první?", focus: "Na co se má tato kapitola zaměřit?", next: "Pokračovat", enter: "Vstoupit do Stromu života", other: "Vlastní zaměření" },
  uk: { eyebrow: "Стратегічна гра життя", title: "Оберіть шлях. Почніть одну реальну місію.", intro: "Habidoo перетворює реальні дії на видимий прогрес Дерева життя.", language: "Оберіть мову", category: "Яку сферу покращити першою?", focus: "На чому зосередитися в цій главі?", next: "Продовжити", enter: "Перейти до Дерева життя", other: "Свій об’єкт фокусу" }
};

const preLoginCopy: Record<Locale, { eyebrow: string; title: string; intro: string; language: string; pillars: string[]; steps: string[]; visualTitle: string; visualSubtitle: string; promise: string }> = {
  en: {
    eyebrow: "Foundation Era",
    title: "Turn self-improvement into a living progression system.",
    intro: "Habidoo replaces scattered routines with guided missions, focus objects, visible progress and account-based sync. Your life tree grows only from real actions.",
    language: "Language",
    pillars: ["Guided missions instead of vague habits", "A Life Tree that shows what is unlocked next", "Stats, rewards and evidence tied to your account"],
    steps: ["Create account", "Choose your first focus", "Complete real missions", "Watch progress become visible"],
    visualTitle: "Life Tree begins here",
    visualSubtitle: "Foundation Era connects identity, missions and measurable progress.",
    promise: "No guest mode. Your progress belongs to your account from the start."
  },
  ru: {
    eyebrow: "Эпоха основ",
    title: "Преврати улучшение жизни в живую систему прогресса.",
    intro: "Habidoo заменяет разрозненные привычки понятными миссиями, объектами фокуса, видимым прогрессом и аккаунтом, где всё сохраняется автоматически.",
    language: "Язык",
    pillars: ["Конкретные миссии вместо туманной рутины", "Дерево жизни показывает следующий шаг", "Статистика, награды и доказательства привязаны к аккаунту"],
    steps: ["Создай аккаунт", "Выбери первый фокус", "Выполняй реальные миссии", "Смотри, как растёт прогресс"],
    visualTitle: "Дерево жизни начинается здесь",
    visualSubtitle: "Эпоха основ соединяет личность, миссии и измеримый прогресс.",
    promise: "Без гостевого режима. Прогресс принадлежит аккаунту с самого начала."
  },
  cs: {
    eyebrow: "Éra základů",
    title: "Proměňte seberozvoj v živý systém postupu.",
    intro: "Habidoo nahrazuje roztříštěné rutiny vedenými misemi, objekty soustředění, viditelným postupem a účtem, kde se vše automaticky ukládá.",
    language: "Jazyk",
    pillars: ["Konkrétní mise místo neurčitých návyků", "Strom života ukazuje další krok", "Statistiky, odměny a důkazy jsou spojené s účtem"],
    steps: ["Vytvořte účet", "Zvolte první zaměření", "Plňte skutečné mise", "Sledujte viditelný postup"],
    visualTitle: "Strom života začíná zde",
    visualSubtitle: "Éra základů propojuje identitu, mise a měřitelný postup.",
    promise: "Žádný hostovský režim. Postup patří k účtu od začátku."
  },
  uk: {
    eyebrow: "Епоха основ",
    title: "Перетвори саморозвиток на живу систему прогресу.",
    intro: "Habidoo замінює розрізнені рутини керованими місіями, об’єктами фокусу, видимим прогресом і акаунтом, де все зберігається автоматично.",
    language: "Мова",
    pillars: ["Конкретні місії замість нечітких звичок", "Дерево життя показує наступний крок", "Статистика, нагороди й докази прив’язані до акаунта"],
    steps: ["Створи акаунт", "Обери перший фокус", "Виконуй реальні місії", "Дивись, як зростає прогрес"],
    visualTitle: "Дерево життя починається тут",
    visualSubtitle: "Епоха основ поєднує особистість, місії та вимірюваний прогрес.",
    promise: "Без гостьового режиму. Прогрес належить акаунту з самого початку."
  }
};

const focusTypes: Record<LifeCategory, FocusObjectType> = { health: "healthRoutine", mind: "learningTopic", finance: "financialGoal", business: "project", career: "careerSkill", relationships: "relationship", creativity: "creativeMedium" };
const desiredOutcomeCopy: Record<Locale, string> = { en: "Create one visible result in this chapter.", ru: "Создать один видимый результат в этой главе.", cs: "Vytvořit v této kapitole jeden viditelný výsledek.", uk: "Створити один видимий результат у цій главі." };
const rootIds: Record<LifeCategory, string> = { health: "health-root", mind: "mind-root", finance: "finance-root", business: "business-root", career: "career-root", relationships: "relationships-root", creativity: "creativity-root" };

const cleanLocaleNames: Record<Locale, string> = {
  en: "English",
  ru: "Русский",
  cs: "Čeština",
  uk: "Українська"
};

const cleanCategoryNames: Record<Locale, Record<LifeCategory, string>> = {
  en: categoryNames.en,
  ru: { health: "Тело и энергия", mind: "Фокус и разум", finance: "Деньги и свобода", business: "Создание и проекты", career: "Направление и карьера", relationships: "Люди и связь", creativity: "Творческая практика" },
  cs: { health: "Tělo a energie", mind: "Soustředění a mysl", finance: "Peníze a svoboda", business: "Tvorba a projekty", career: "Směr a kariéra", relationships: "Lidé a vztahy", creativity: "Tvůrčí praxe" },
  uk: { health: "Тіло й енергія", mind: "Фокус і розум", finance: "Гроші й свобода", business: "Створення і проєкти", career: "Напрям і кар’єра", relationships: "Люди й зв’язок", creativity: "Творча практика" }
};

const cleanFocusSuggestions: Record<Locale, Record<LifeCategory, string[]>> = {
  en: focusSuggestions.en,
  ru: { health: ["Утренняя энергия", "Режим сна", "Ежедневное движение"], mind: ["Текущий приоритет", "Тема обучения", "Режим фокуса"], finance: ["Ясность бюджета", "Первый резерв", "Контроль расходов"], business: ["Сайт или приложение", "Рабочий процесс", "Идея услуги"], career: ["Доказательство навыка", "Профессиональный профиль", "Навык для роли"], relationships: ["Важный человек", "Связь с семьёй", "Дружба"], creativity: ["Текст", "Рисунок или дизайн", "Фото или видео"] },
  cs: { health: ["Ranní energie", "Spánkový režim", "Denní pohyb"], mind: ["Současná priorita", "Téma učení", "Režim soustředění"], finance: ["Přehled rozpočtu", "První rezerva", "Kontrola výdajů"], business: ["Web nebo aplikace", "Pracovní proces", "Nápad na službu"], career: ["Důkaz dovednosti", "Profesní profil", "Dovednost pro roli"], relationships: ["Důležitý člověk", "Rodinné spojení", "Přátelství"], creativity: ["Psaní", "Kresba nebo design", "Foto nebo video"] },
  uk: { health: ["Ранкова енергія", "Режим сну", "Щоденний рух"], mind: ["Поточний пріоритет", "Тема навчання", "Режим фокуса"], finance: ["Ясність бюджету", "Перший резерв", "Контроль витрат"], business: ["Сайт або застосунок", "Робочий процес", "Ідея послуги"], career: ["Доказ навички", "Професійний профіль", "Навичка для ролі"], relationships: ["Важлива людина", "Зв’язок із родиною", "Дружба"], creativity: ["Текст", "Малюнок або дизайн", "Фото або відео"] }
};

const cleanOnboardingCopy: typeof onboardingCopy = {
  en: onboardingCopy.en,
  ru: { eyebrow: "Стратегия жизни", title: "Выберите путь. Начните одну реальную миссию.", intro: "Habidoo превращает реальные действия в видимый прогресс Дерева жизни.", language: "Выберите язык", category: "Какую сферу улучшить первой?", focus: "На чём сфокусировать эту главу?", next: "Продолжить", enter: "Перейти к Дереву жизни", other: "Свой фокус" },
  cs: { eyebrow: "Strategie života", title: "Zvolte cestu. Začněte jednu skutečnou misi.", intro: "Habidoo mění skutečné kroky na viditelný postup ve Stromu života.", language: "Zvolte jazyk", category: "Kterou oblast zlepšit jako první?", focus: "Na co se má tato kapitola zaměřit?", next: "Pokračovat", enter: "Vstoupit do Stromu života", other: "Vlastní zaměření" },
  uk: { eyebrow: "Стратегія життя", title: "Оберіть шлях. Почніть одну реальну місію.", intro: "Habidoo перетворює реальні дії на видимий прогрес Дерева життя.", language: "Оберіть мову", category: "Яку сферу покращити першою?", focus: "На чому зосередити цю главу?", next: "Продовжити", enter: "Перейти до Дерева життя", other: "Власний фокус" }
};

const cleanPreLoginCopy: typeof preLoginCopy = {
  en: preLoginCopy.en,
  ru: {
    eyebrow: "Эпоха основ",
    title: "Превратите улучшение жизни в живую систему прогресса.",
    intro: "Habidoo заменяет разрозненные привычки понятными миссиями, объектами фокуса, видимым прогрессом и аккаунтом, где всё сохраняется автоматически.",
    language: "Язык",
    pillars: ["Конкретные миссии вместо туманной рутины", "Дерево жизни показывает следующий шаг", "Статистика, награды и доказательства привязаны к аккаунту"],
    steps: ["Создайте аккаунт", "Выберите первый фокус", "Выполните реальные миссии", "Увидьте прогресс"],
    visualTitle: "Дерево жизни начинается здесь",
    visualSubtitle: "Эпоха основ соединяет личность, миссии и измеримый прогресс.",
    promise: "Без гостевого режима. Прогресс принадлежит вашему аккаунту с самого начала."
  },
  cs: {
    eyebrow: "Éra základů",
    title: "Proměňte seberozvoj v živý systém postupu.",
    intro: "Habidoo nahrazuje roztříštěné rutiny vedenými misemi, objekty soustředění, viditelným postupem a účtem, kde se vše automaticky ukládá.",
    language: "Jazyk",
    pillars: ["Konkrétní mise místo neurčitých návyků", "Strom života ukazuje další krok", "Statistiky, odměny a důkazy jsou spojené s účtem"],
    steps: ["Vytvořte účet", "Zvolte první zaměření", "Plňte skutečné mise", "Sledujte viditelný postup"],
    visualTitle: "Strom života začíná zde",
    visualSubtitle: "Éra základů propojuje identitu, mise a měřitelný postup.",
    promise: "Žádný hostovský režim. Postup patří k účtu od začátku."
  },
  uk: {
    eyebrow: "Ера основ",
    title: "Перетворіть саморозвиток на живу систему прогресу.",
    intro: "Habidoo замінює розрізнені рутини керованими місіями, об’єктами фокуса, видимим прогресом і акаунтом, де все зберігається автоматично.",
    language: "Мова",
    pillars: ["Конкретні місії замість нечітких звичок", "Дерево життя показує наступний крок", "Статистика, нагороди й докази прив’язані до акаунта"],
    steps: ["Створіть акаунт", "Оберіть перший фокус", "Виконайте реальні місії", "Побачте прогрес"],
    visualTitle: "Дерево життя починається тут",
    visualSubtitle: "Ера основ поєднує особистість, місії та вимірюваний прогрес.",
    promise: "Без гостьового режиму. Прогрес належить акаунту з самого початку."
  }
};

const landingLegalCopy: Record<Locale, { chips: string[]; trust: string; rules: string; terms: string; privacy: string; copyright: string }> = {
  en: { chips: ["Real action", "Saved progress", "Clear next step"], trust: "Habidoo is a self-improvement product, not medical, legal or financial advice.", rules: "Rules", terms: "Terms", privacy: "Privacy", copyright: "© 2026 Habidoo. Built for real progress." },
  ru: { chips: ["Реальные действия", "Сохранённый прогресс", "Понятный следующий шаг"], trust: "Habidoo — продукт для саморазвития, а не медицинская, юридическая или финансовая консультация.", rules: "Правила", terms: "Условия", privacy: "Приватность", copyright: "© 2026 Habidoo. Создано для реального прогресса." },
  cs: { chips: ["Skutečné kroky", "Uložený postup", "Jasný další krok"], trust: "Habidoo je produkt pro seberozvoj, nikoli lékařské, právní ani finanční poradenství.", rules: "Pravidla", terms: "Podmínky", privacy: "Soukromí", copyright: "© 2026 Habidoo. Vytvořeno pro skutečný pokrok." },
  uk: { chips: ["Реальні дії", "Збережений прогрес", "Чіткий наступний крок"], trust: "Habidoo — продукт для саморозвитку, а не медична, юридична чи фінансова консультація.", rules: "Правила", terms: "Умови", privacy: "Приватність", copyright: "© 2026 Habidoo. Створено для реального прогресу." }
};

export default function HomePage() {
  const router = useRouter();
  const onboardingCompleted = useLifeStore((state) => state.onboardingCompleted);
  const completeOnboarding = useLifeStore((state) => state.completeOnboarding);
  const setStoredLocale = useLifeStore((state) => state.setLocale);
  const auth = useAuthState();
  const [hydrated, setHydrated] = useState(false);
  const [step, setStep] = useState(0);
  const [locale, setLocale] = useState<Locale>("en");
  const [category, setCategory] = useState<LifeCategory | null>(null);
  const [focus, setFocus] = useState("");
  const finishingRef = useRef(false);
  const copy = cleanOnboardingCopy[locale];
  const landing = cleanPreLoginCopy[locale];
  const legal = landingLegalCopy[locale];

  useEffect(() => {
    setHydrated(useLifeStore.persist.hasHydrated());
    return useLifeStore.persist.onFinishHydration(() => setHydrated(true));
  }, []);
  useEffect(() => {
    if (hydrated) setLocale(useLifeStore.getState().locale);
  }, [hydrated]);
  useEffect(() => {
    if (!hydrated || auth.status !== "authenticated" || finishingRef.current) return;
    if (onboardingCompleted) router.replace("/tree");
  }, [auth.status, hydrated, onboardingCompleted, router]);
  const suggestions = useMemo(() => category ? cleanFocusSuggestions[locale][category] : [], [category, locale]);

  if (!hydrated || auth.status === "loading" || (auth.status === "authenticated" && onboardingCompleted)) return <main className="min-h-screen bg-background" />;

  if (auth.status !== "authenticated") {
    return (
      <AppShell hideNavigation>
        <div className="mx-auto grid min-h-[78vh] max-w-6xl gap-6 py-4 lg:grid-cols-[1.06fr_0.94fr] lg:items-center">
          <section className="relative grid gap-5 overflow-hidden rounded-[2rem] border border-border/80 bg-card/65 p-5 shadow-node backdrop-blur sm:p-7">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_16%_10%,rgba(255,216,137,.20),transparent_30%),radial-gradient(circle_at_85%_25%,rgba(126,165,255,.18),transparent_32%),linear-gradient(135deg,rgba(255,255,255,.06),transparent_48%)]" />
            <div className="relative grid gap-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-xs font-black uppercase tracking-[0.22em] text-primary">
                <Sparkles size={14} />{landing.eyebrow}
              </p>
              <span className="text-xs font-black uppercase tracking-[0.18em] text-muted-foreground">{landing.language}</span>
              <div className="flex rounded-full border border-border bg-background/65 p-1 shadow-sm">
                {locales.map((item) => (
                  <button key={item.id} type="button" onClick={() => { setLocale(item.id); setStoredLocale(item.id); }} className={cn("rounded-full px-3 py-1 text-xs font-black", locale === item.id ? "bg-primary text-primary-foreground" : "text-muted-foreground")}>{item.id.toUpperCase()}</button>
                ))}
              </div>
            </div>
            <h1 className="text-4xl font-black leading-[0.98] text-foreground sm:text-6xl">{landing.title}</h1>
            <p className="max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">{landing.intro}</p>
            <div className="grid gap-3 text-sm font-bold text-muted-foreground sm:grid-cols-3">
              {landing.pillars.map((pillar, index) => {
                const icons = [Target, Trophy, ShieldCheck];
                const PillarIcon = icons[index] ?? Target;
                return (
                  <div key={pillar} className="rounded-2xl border border-border bg-background/55 p-4 shadow-sm">
                    <PillarIcon className="mb-3 text-primary" size={19} />
                    {pillar}
                  </div>
                );
              })}
            </div>
            <div className="rounded-2xl border border-primary/25 bg-primary/10 p-4">
              <p className="flex items-start gap-2 text-sm font-black text-foreground"><Lock className="mt-0.5 shrink-0 text-primary" size={16} />{landing.promise}</p>
              <div className="mt-3 grid gap-2 sm:grid-cols-4">
                {landing.steps.map((stepItem, index) => <div key={stepItem} className="rounded-xl border border-border bg-background/55 p-3 text-xs font-bold text-muted-foreground"><span className="mr-2 text-primary">0{index + 1}</span>{stepItem}</div>)}
              </div>
            </div>
            </div>
          </section>
          <aside className="grid gap-4">
            <div className="relative overflow-hidden rounded-[2.25rem] border border-primary/25 bg-[#10131c] text-white shadow-node">
              <Image
                src="/art/landing/habidoo-life-system-hero.png"
                alt="Habidoo life tree showing missions, focus areas, progress and statistics"
                width={1680}
                height={945}
                priority
                className="aspect-[16/10] w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#10131c] via-[#10131c]/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 grid gap-2 p-5 sm:p-6">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.22em] text-amber-200">{landing.visualTitle}</p>
                  <p className="mt-2 text-sm leading-6 text-white/70">{landing.visualSubtitle}</p>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center text-[11px] font-black text-white/70">
                  {legal.chips.map((chip) => <div key={chip} className="rounded-2xl border border-white/10 bg-white/10 p-3">{chip}</div>)}
                </div>
              </div>
            </div>
            <CloudAccountPanel locale={locale} />
            <footer className="rounded-2xl border border-border bg-card/65 p-4 text-xs leading-5 text-muted-foreground">
              <p>{legal.trust}</p>
              <div className="mt-3 flex flex-wrap gap-3 font-bold">
                <Link className="text-primary hover:underline" href="/rules">{legal.rules}</Link>
                <Link className="text-primary hover:underline" href="/terms">{legal.terms}</Link>
                <Link className="text-primary hover:underline" href="/privacy">{legal.privacy}</Link>
              </div>
              <p className="mt-3">{legal.copyright}</p>
            </footer>
          </aside>
        </div>
      </AppShell>
    );
  }

  function finish() {
    if (!category || !focus.trim()) return;
    finishingRef.current = true;
    const now = Date.now();
    completeOnboarding(locale, category, { id: `focus:${category}:${now}`, type: focusTypes[category], category, name: focus.trim(), desiredOutcome: desiredOutcomeCopy[locale], createdAt: now });
    router.push(`/tree?focus=${rootIds[category]}`);
  }

  return (
    <AppShell hideNavigation>
      <div className="mx-auto grid min-h-[72vh] max-w-2xl place-items-center">
        <Card className="w-full border-primary/35 bg-card/90">
          <CardHeader><p className="text-xs font-black uppercase tracking-[0.2em] text-primary">{copy.eyebrow}</p><CardTitle className="mt-2 text-2xl sm:text-3xl">{copy.title}</CardTitle><p className="mt-2 text-sm leading-6 text-muted-foreground">{copy.intro}</p></CardHeader>
          <CardContent className="grid gap-4">
            {step === 0 ? <><h2 className="font-black text-foreground">{copy.language}</h2><div className="grid grid-cols-2 gap-2">{locales.map((item) => <button key={item.id} type="button" className={cn("min-h-12 rounded-md border p-3 font-bold", locale === item.id ? "border-primary bg-primary/10 text-primary" : "border-border bg-muted/30")} onClick={() => { setLocale(item.id); setStoredLocale(item.id); }}>{cleanLocaleNames[item.id]}</button>)}</div><Button onClick={() => setStep(1)}>{copy.next}<ArrowRight size={16} /></Button></> : null}
            {step === 1 ? <><h2 className="font-black text-foreground">{copy.category}</h2><div className="grid gap-2 sm:grid-cols-2">{(Object.keys(cleanCategoryNames[locale]) as LifeCategory[]).map((item) => <button key={item} type="button" className={cn("flex min-h-12 items-center gap-3 rounded-md border p-3 text-left font-bold", category === item ? "border-primary bg-primary/10" : "border-border bg-muted/30")} onClick={() => { setCategory(item); setFocus(""); }}><span className="size-3 shrink-0 rounded-full" style={{ background: categoryColors[item] }} />{cleanCategoryNames[locale][item]}{category === item ? <Check className="ml-auto text-primary" size={16} /> : null}</button>)}</div><Button disabled={!category} onClick={() => setStep(2)}>{copy.next}<ArrowRight size={16} /></Button></> : null}
            {step === 2 && category ? <><h2 className="font-black text-foreground">{copy.focus}</h2><div className="grid gap-2">{suggestions.map((suggestion) => <button key={suggestion} type="button" className={cn("min-h-11 rounded-md border p-3 text-left font-bold", focus === suggestion ? "border-primary bg-primary/10" : "border-border bg-muted/30")} onClick={() => setFocus(suggestion)}>{suggestion}</button>)}</div><input className="h-11 rounded-md border border-border bg-background/60 px-3 text-sm outline-none focus:border-primary" placeholder={copy.other} value={suggestions.includes(focus) ? "" : focus} onChange={(event) => setFocus(event.target.value)} /><Button disabled={!focus.trim()} onClick={finish}><GitBranch size={17} />{copy.enter}</Button></> : null}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
