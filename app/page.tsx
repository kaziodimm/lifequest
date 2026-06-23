"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Check, GitBranch } from "lucide-react";
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
  const copy = onboardingCopy[locale];
  const landing = preLoginCopy[locale];

  useEffect(() => {
    setHydrated(useLifeStore.persist.hasHydrated());
    return useLifeStore.persist.onFinishHydration(() => setHydrated(true));
  }, []);
  useEffect(() => {
    if (hydrated) setLocale(useLifeStore.getState().locale);
  }, [hydrated]);
  useEffect(() => {
    if (!hydrated || auth.status !== "authenticated" || !auth.profileLoaded || finishingRef.current) return;
    if (!auth.hasProfile) {
      router.replace("/profile");
      return;
    }
    if (onboardingCompleted) router.replace("/tree");
  }, [auth.hasProfile, auth.profileLoaded, auth.status, hydrated, onboardingCompleted, router]);
  const suggestions = useMemo(() => category ? focusSuggestions[locale][category] : [], [category, locale]);

  if (!hydrated || auth.status === "loading" || (auth.status === "authenticated" && (!auth.profileLoaded || !auth.hasProfile || onboardingCompleted))) return <main className="min-h-screen bg-background" />;

  if (auth.status !== "authenticated") {
    return (
      <AppShell hideNavigation>
        <div className="mx-auto grid min-h-[78vh] max-w-6xl gap-6 py-4 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
          <section className="grid gap-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-primary">{landing.eyebrow}</p>
              <div className="flex rounded-full border border-border bg-card/70 p-1">
                {locales.map((item) => (
                  <button key={item.id} type="button" onClick={() => { setLocale(item.id); setStoredLocale(item.id); }} className={cn("rounded-full px-3 py-1 text-xs font-black", locale === item.id ? "bg-primary text-primary-foreground" : "text-muted-foreground")}>{item.id.toUpperCase()}</button>
                ))}
              </div>
            </div>
            <h1 className="text-4xl font-black leading-tight text-foreground sm:text-6xl">{landing.title}</h1>
            <p className="max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">{landing.intro}</p>
            <div className="grid gap-3 text-sm font-bold text-muted-foreground sm:grid-cols-3">
              {landing.pillars.map((pillar) => <div key={pillar} className="rounded-xl border border-border bg-card/75 p-4 shadow-sm">{pillar}</div>)}
            </div>
            <div className="rounded-2xl border border-primary/25 bg-primary/5 p-4">
              <p className="text-sm font-black text-foreground">{landing.promise}</p>
              <div className="mt-3 grid gap-2 sm:grid-cols-4">
                {landing.steps.map((stepItem, index) => <div key={stepItem} className="rounded-lg border border-border bg-background/45 p-3 text-xs font-bold text-muted-foreground"><span className="mr-2 text-primary">0{index + 1}</span>{stepItem}</div>)}
              </div>
            </div>
          </section>
          <aside className="grid gap-4">
            <div className="relative overflow-hidden rounded-[2rem] border border-primary/25 bg-card/80 p-6 shadow-node">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(143,181,255,.22),transparent_34%),radial-gradient(circle_at_80%_70%,rgba(255,205,120,.14),transparent_30%)]" />
              <div className="relative grid gap-5">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.22em] text-primary">{landing.visualTitle}</p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{landing.visualSubtitle}</p>
                </div>
                <div className="relative mx-auto h-64 w-full max-w-sm">
                  <div className="absolute left-1/2 top-8 h-44 w-px -translate-x-1/2 bg-primary/35" />
                  <div className="absolute left-[24%] top-24 h-px w-[52%] bg-primary/35" />
                  <div className="absolute left-[30%] top-36 h-px w-[40%] bg-primary/25" />
                  {[
                    ["Account", "left-1/2 top-2 -translate-x-1/2 border-primary/60 bg-primary/20"],
                    ["Focus", "left-[8%] top-20 border-sky-400/50 bg-sky-400/10"],
                    ["Mission", "right-[8%] top-20 border-amber-300/50 bg-amber-300/10"],
                    ["Tree", "left-[22%] bottom-10 border-emerald-300/50 bg-emerald-300/10"],
                    ["Stats", "right-[20%] bottom-10 border-violet-300/50 bg-violet-300/10"]
                  ].map(([label, className]) => (
                    <div key={label} className={cn("absolute grid size-20 place-items-center rounded-2xl border text-center text-xs font-black text-foreground shadow-node backdrop-blur", className)}>{label}</div>
                  ))}
                </div>
              </div>
            </div>
            <CloudAccountPanel />
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
            {step === 0 ? <><h2 className="font-black text-foreground">{copy.language}</h2><div className="grid grid-cols-2 gap-2">{locales.map((item) => <button key={item.id} type="button" className={cn("min-h-12 rounded-md border p-3 font-bold", locale === item.id ? "border-primary bg-primary/10 text-primary" : "border-border bg-muted/30")} onClick={() => { setLocale(item.id); setStoredLocale(item.id); }}>{item.label}</button>)}</div><Button onClick={() => setStep(1)}>{copy.next}<ArrowRight size={16} /></Button></> : null}
            {step === 1 ? <><h2 className="font-black text-foreground">{copy.category}</h2><div className="grid gap-2 sm:grid-cols-2">{(Object.keys(categoryNames[locale]) as LifeCategory[]).map((item) => <button key={item} type="button" className={cn("flex min-h-12 items-center gap-3 rounded-md border p-3 text-left font-bold", category === item ? "border-primary bg-primary/10" : "border-border bg-muted/30")} onClick={() => { setCategory(item); setFocus(""); }}><span className="size-3 shrink-0 rounded-full" style={{ background: categoryColors[item] }} />{categoryNames[locale][item]}{category === item ? <Check className="ml-auto text-primary" size={16} /> : null}</button>)}</div><Button disabled={!category} onClick={() => setStep(2)}>{copy.next}<ArrowRight size={16} /></Button></> : null}
            {step === 2 && category ? <><h2 className="font-black text-foreground">{copy.focus}</h2><div className="grid gap-2">{suggestions.map((suggestion) => <button key={suggestion} type="button" className={cn("min-h-11 rounded-md border p-3 text-left font-bold", focus === suggestion ? "border-primary bg-primary/10" : "border-border bg-muted/30")} onClick={() => setFocus(suggestion)}>{suggestion}</button>)}</div><input className="h-11 rounded-md border border-border bg-background/60 px-3 text-sm outline-none focus:border-primary" placeholder={copy.other} value={suggestions.includes(focus) ? "" : focus} onChange={(event) => setFocus(event.target.value)} /><Button disabled={!focus.trim()} onClick={finish}><GitBranch size={17} />{copy.enter}</Button></> : null}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
