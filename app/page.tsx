"use client";

import Link from "next/link";
import { ArrowRight, Flame, Gauge, GitBranch, Sparkles, Timer, Zap } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { lifeEras } from "@/lib/eras";
import { categoryProgress, nextStrategicRecommendation } from "@/lib/insights";
import { categoryColors, technologies } from "@/lib/life-tree";
import { dailyCompletionPercent, levelFromXp } from "@/lib/progression";
import { useLifeStore } from "@/lib/store";
import { translate } from "@/lib/i18n";
import { localizeTechnology } from "@/lib/technology-i18n";

export default function HomePage() {
  const state = useLifeStore();
  const level = levelFromXp(state.totalXp);
  const completion = dailyCompletionPercent(state);
  const recommendation = nextStrategicRecommendation(state);
  const categories = categoryProgress(state);
  const currentEra = lifeEras.find((era) => era.id === state.currentEra) ?? lifeEras[0];
  const treeCompletion = Math.round((state.completedTechnologyIds.length / technologies.length) * 100);
  const activeMissions = Object.entries(state.technologyRuntime).filter(([, runtime]) => runtime.status === "active");
  const nextUnlock = technologies.find((tech) => !state.completedTechnologyIds.includes(tech.id) && tech.parents.every((parentId) => state.completedTechnologyIds.includes(parentId)));
  const localizedNextUnlock = nextUnlock ? localizeTechnology(nextUnlock, state.locale) : null;

  return (
    <AppShell>
      <section className="mb-5 rounded-lg border border-primary/30 bg-card/70 p-5 shadow-node backdrop-blur">
        <p className="mb-2 text-xs font-bold uppercase tracking-wide text-primary">{translate(state.locale, "Life Strategy Command")}</p>
        <h1 className="text-3xl font-black tracking-tight text-foreground">{translate(state.locale, "Unlock your life, one technology at a time.")}</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">{translate(state.locale, "Habidoo is not a todo list. Start missions, respect cooldowns, and turn real effort into Life Tree progress.")}</p>
        <Button asChild className="mt-5">
          <Link href="/tree">{translate(state.locale, "Open Life Tree")} <ArrowRight size={17} /></Link>
        </Button>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Sparkles size={17} className="text-primary" />{translate(state.locale, "Level")} {level.level}</CardTitle></CardHeader>
          <CardContent><Progress value={level.progress} /><p className="mt-2 text-xs text-muted-foreground">{level.current}/{level.needed} {translate(state.locale, "XP to next level")}</p></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><GitBranch size={17} className="text-primary" />{translate(state.locale, "Life Tree")}</CardTitle></CardHeader>
          <CardContent><p className="text-3xl font-black">{treeCompletion}%</p><p className="mt-2 text-xs text-muted-foreground">{state.completedTechnologyIds.length}/{technologies.length} {translate(state.locale, "technologies unlocked")}</p></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Flame size={17} className="text-strategy-red" />{translate(state.locale, "Streak")}</CardTitle></CardHeader>
          <CardContent><p className="text-3xl font-black">{state.streak} {translate(state.locale, "days")}</p></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Gauge size={17} className="text-strategy-green" />{translate(state.locale, "Today")}</CardTitle></CardHeader>
          <CardContent><p className="text-3xl font-black">{completion}%</p></CardContent>
        </Card>
      </section>

      <section className="mt-5 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="border-primary/25 bg-primary/5">
          <CardHeader><CardTitle className="flex items-center gap-2"><Zap size={17} className="text-strategy-gold" />{translate(state.locale, "Current Era")}</CardTitle></CardHeader>
          <CardContent>
            <p className="text-2xl font-black text-foreground">{translate(state.locale, currentEra.title)}</p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{translate(state.locale, currentEra.description)}</p>
            <div className="mt-4 rounded-md border border-border bg-background/45 p-3">
              <p className="text-xs font-black uppercase tracking-wide text-muted-foreground">{translate(state.locale, "Next unlockable technology")}</p>
              <p className="mt-1 font-bold text-foreground">{localizedNextUnlock?.title ?? translate(state.locale, "Era mastery")}</p>
              <p className="mt-1 text-xs text-muted-foreground">{localizedNextUnlock?.description ?? translate(state.locale, "Complete the remaining available branches.")}</p>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4">
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Timer size={17} className="text-primary" />{translate(state.locale, "Active Missions")}</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {activeMissions.length ? activeMissions.map(([technologyId, runtime]) => {
                const tech = technologies.find((item) => item.id === technologyId);
                return (
                  <div key={technologyId} className="rounded-md border border-primary/35 bg-primary/10 p-3">
                    <p className="font-bold text-foreground">{tech ? localizeTechnology(tech, state.locale).title : translate(state.locale, "Life mission")}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{translate(state.locale, "Started")} {runtime.startedAt ? new Date(runtime.startedAt).toLocaleTimeString(state.locale) : translate(state.locale, "now")}</p>
                  </div>
                );
              }) : (
                <div className="rounded-md border border-border bg-muted/35 p-3">
                  <p className="font-bold text-foreground">{translate(state.locale, "No active mission")}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{translate(state.locale, "Open the Life Tree and start one focused action.")}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><GitBranch size={17} className="text-primary" />{translate(state.locale, "Strategic Recommendation")}</CardTitle></CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p className="text-base font-bold text-foreground">{recommendation.technologyId ? `${state.locale === "ru" ? "Исследуйте" : "Research"} ${localizeTechnology(technologies.find((item) => item.id === recommendation.technologyId)!, state.locale).title}` : translate(state.locale, recommendation.title)}</p>
              <p>{recommendation.technologyId ? localizeTechnology(technologies.find((item) => item.id === recommendation.technologyId)!, state.locale).description : translate(state.locale, recommendation.description)}</p>
              <Button asChild variant="outline" size="sm"><Link href="/tree">{translate(state.locale, "Inspect Tree")} <ArrowRight size={15} /></Link></Button>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="mt-5">
        <Card>
          <CardHeader><CardTitle>{translate(state.locale, "Life Domains")}</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {categories.map((item) => (
              <div key={item.category}>
                <div className="mb-1 flex justify-between text-xs">
                  <span className="font-bold" style={{ color: categoryColors[item.category as keyof typeof categoryColors] }}>{translate(state.locale, item.label)}</span>
                  <span className="text-muted-foreground">{item.unlocked}/{item.total}</span>
                </div>
                <Progress value={item.percent} />
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </AppShell>
  );
}
