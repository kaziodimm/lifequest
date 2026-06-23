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

  useEffect(() => {
    setHydrated(useLifeStore.persist.hasHydrated());
    return useLifeStore.persist.onFinishHydration(() => setHydrated(true));
  }, []);
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
        <div className="mx-auto grid min-h-[72vh] max-w-5xl items-center gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="grid gap-5">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-primary">Life Strategy Game</p>
            <h1 className="text-4xl font-black leading-tight text-foreground sm:text-5xl">Build your life like a living progression tree.</h1>
            <p className="max-w-2xl text-base leading-7 text-muted-foreground">Habidoo turns real habits, missions, focus objects and progress into one account-based system. Create an account to enter your tree and keep progress synced.</p>
            <div className="grid gap-3 text-sm font-bold text-muted-foreground sm:grid-cols-3">
              <div className="rounded-lg border border-border bg-card/70 p-4">Guided missions</div>
              <div className="rounded-lg border border-border bg-card/70 p-4">Life tree progress</div>
              <div className="rounded-lg border border-border bg-card/70 p-4">Stats and rewards</div>
            </div>
          </section>
          <CloudAccountPanel />
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
