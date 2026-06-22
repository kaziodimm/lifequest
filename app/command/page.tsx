"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, CheckCircle2, Clock, Play, Target } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { translate } from "@/lib/i18n";
import { applyFocusObject, localizeMissionDefinition } from "@/lib/mission-i18n";
import { getMissionDefinition } from "@/lib/missions";
import { technologies } from "@/lib/life-tree";
import { getTechnologyLockReasons } from "@/lib/progression";
import { useLifeStore } from "@/lib/store";
import { localizeTechnology } from "@/lib/technology-i18n";
import { cn } from "@/lib/utils";

function formatDuration(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export default function CommandPage() {
  const [now, setNow] = useState(() => Date.now());
  const state = useLifeStore();
  const startTechnologyMission = useLifeStore((current) => current.startTechnologyMission);
  const planner = useLifeStore((current) => current.planner);
  const updatePlannerBlock = useLifeStore((current) => current.updatePlannerBlock);
  const togglePlannerBlock = useLifeStore((current) => current.togglePlannerBlock);

  useEffect(() => {
    const interval = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(interval);
  }, []);

  const activeTechnology = technologies.find((technology) => state.technologyRuntime[technology.id]?.status === "active");
  const available = technologies.filter((technology) => {
    if (state.completedTechnologyIds.includes(technology.id) || technology.id === activeTechnology?.id) return false;
    const runtime = state.technologyRuntime[technology.id];
    if (runtime?.cooldownUntil && runtime.cooldownUntil > now) return false;
    return getTechnologyLockReasons(technology, state).length === 0;
  }).slice(0, 3);
  const recommendation = available[0];
  const alternatives = available.slice(1, 3);
  const globalCooldownSeconds = state.globalMissionCooldownUntil ? Math.max(0, Math.floor((state.globalMissionCooldownUntil - now) / 1000)) : 0;

  function missionCopy(technology: (typeof technologies)[number]) {
    const localizedTechnology = localizeTechnology(technology, state.locale);
    const focus = state.focusObjects.find((item) => item.category === technology.category);
    return applyFocusObject(localizeMissionDefinition(getMissionDefinition(localizedTechnology), state.locale), focus, state.locale);
  }

  return (
    <AppShell>
      <div className="mb-4">
        <p className="mb-2 text-xs font-bold uppercase tracking-wide text-primary">{translate(state.locale, "Morning System")}</p>
        <h1 className="text-2xl font-black text-foreground">{translate(state.locale, "Daily Command Center")}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{translate(state.locale, "One mission system: continue the active mission or choose the next available Life Tree upgrade.")}</p>
      </div>

      <section className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="grid content-start gap-4">
          <Card className={cn(activeTechnology && "border-primary/55 bg-primary/5")}>
            <CardHeader><CardTitle className="flex items-center gap-2"><Target size={18} className="text-primary" />{translate(state.locale, "Active Missions")}</CardTitle></CardHeader>
            <CardContent>
              {activeTechnology ? (() => {
                const definition = missionCopy(activeTechnology);
                const runtime = state.technologyRuntime[activeTechnology.id];
                const elapsed = runtime.startedAt ? Math.max(0, Math.floor((now - runtime.startedAt) / 1000)) : 0;
                return <div className="grid gap-3"><div><p className="text-lg font-black text-foreground">{localizeTechnology(activeTechnology, state.locale).title}</p><p className="mt-1 text-sm text-muted-foreground">{definition.actionTitle}</p></div><div className="rounded-md border border-border bg-background/50 p-3"><p className="text-xs font-bold text-muted-foreground">{translate(state.locale, "Research timer:")}</p><p className="mt-1 text-xl font-black text-primary">{formatDuration(elapsed)} / {formatDuration(definition.minimumDurationSeconds)}</p></div><Button asChild><Link href="/tree">{translate(state.locale, "Continue in Life Tree")} <ArrowRight size={16} /></Link></Button></div>;
              })() : <div className="rounded-md border border-border bg-muted/35 p-3"><p className="font-bold text-foreground">{translate(state.locale, "No active mission")}</p><p className="mt-1 text-xs text-muted-foreground">{translate(state.locale, "Choose the recommended available technology below.")}</p></div>}
            </CardContent>
          </Card>

          {recommendation ? <Card><CardHeader><CardTitle>{translate(state.locale, "Recommended next mission")}</CardTitle></CardHeader><CardContent className="grid gap-3"><div><p className="font-black text-foreground">{localizeTechnology(recommendation, state.locale).title}</p><p className="mt-1 text-sm text-muted-foreground">{missionCopy(recommendation).concreteOutcome}</p></div><Button disabled={Boolean(activeTechnology) || globalCooldownSeconds > 0} onClick={() => startTechnologyMission(recommendation.id)}><Play size={16} />{globalCooldownSeconds > 0 ? `${translate(state.locale, "Cooldown")} ${formatDuration(globalCooldownSeconds)}` : translate(state.locale, "Start Mission")}</Button></CardContent></Card> : null}

          {alternatives.length ? <Card><CardHeader><CardTitle>{translate(state.locale, "Available alternatives")}</CardTitle></CardHeader><CardContent className="grid gap-2">{alternatives.map((technology) => <div key={technology.id} className="flex items-center justify-between gap-3 rounded-md border border-border bg-muted/30 p-3"><div className="min-w-0"><p className="font-bold text-foreground">{localizeTechnology(technology, state.locale).title}</p><p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{missionCopy(technology).concreteOutcome}</p></div><Button size="sm" variant="outline" disabled={Boolean(activeTechnology) || globalCooldownSeconds > 0} onClick={() => startTechnologyMission(technology.id)}><Play size={15} />{translate(state.locale, "Start")}</Button></div>)}</CardContent></Card> : null}
        </div>

        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Clock size={18} className="text-strategy-gold" />{translate(state.locale, "24h Planner")}</CardTitle></CardHeader>
          <CardContent className="grid max-h-[720px] gap-2 overflow-auto">
            <p className="mb-1 text-xs leading-5 text-muted-foreground">{translate(state.locale, "Planner blocks support execution but do not award XP. Link them to the active or next Life Tree mission.")}</p>
            {planner.map((block) => (
              <div key={block.hour} className={cn("grid gap-2 rounded-md border bg-muted/30 p-3 sm:grid-cols-[56px_1fr_190px_44px] sm:items-center", block.completed ? "border-primary/60 bg-primary/10" : "border-border")}>
                <span className="text-xs font-black text-primary">{String(block.hour).padStart(2, "0")}:00</span>
                <input className="h-10 rounded-md border border-border bg-background/60 px-3 text-sm outline-none focus:border-primary" value={block.plan} placeholder={translate(state.locale, "Assign a real-world action")} onChange={(event) => updatePlannerBlock(block.hour, event.target.value, block.technologyId)} />
                <select className="h-10 rounded-md border border-border bg-background/60 px-3 text-sm outline-none focus:border-primary" value={block.technologyId ?? ""} onChange={(event) => updatePlannerBlock(block.hour, block.plan, event.target.value || undefined)}>
                  <option value="">{translate(state.locale, "No technology")}</option>
                  {technologies.map((technology) => <option key={technology.id} value={technology.id}>{localizeTechnology(technology, state.locale).title}</option>)}
                </select>
                <Button size="icon" variant={block.completed ? "default" : "outline"} onClick={() => togglePlannerBlock(block.hour)}><CheckCircle2 size={17} /></Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </AppShell>
  );
}
