"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, CalendarCheck, Flag, Play, Target } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { translate } from "@/lib/i18n";
import { applyFocusObject, localizeMissionDefinition } from "@/lib/mission-i18n";
import { getMissionDefinition } from "@/lib/missions";
import { getCompletedGuideMission, getGuideMission, guideMissions, localizeGuideMission } from "@/lib/guide-missions";
import { technologies } from "@/lib/life-tree";
import { getTechnologyLockReasons } from "@/lib/progression";
import { recommendUnlocked } from "@/lib/mission-rules";
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

  useEffect(() => {
    const interval = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(interval);
  }, []);

  const activeTechnology = technologies.find((technology) => state.technologyRuntime[technology.id]?.status === "active");
  const available = recommendUnlocked(technologies.map((technology) => {
    const runtime = state.technologyRuntime[technology.id];
    return {
      technology,
      category: technology.category,
      locked: getTechnologyLockReasons(technology, state).length > 0,
      completed: state.completedTechnologyIds.includes(technology.id),
      status: runtime?.status,
      cooldownUntil: runtime?.cooldownUntil,
      progress: runtime?.progress ?? 0,
      hasFocus: state.focusObjects.some((focus) => focus.category === technology.category),
      isMilestone: technology.type === "milestone" || technology.type === "challenge"
    };
  }), { primaryCategory: state.primaryCategory, now, limit: 3 }).map((item) => item.technology).filter((technology) => technology.id !== activeTechnology?.id);
  const recommendation = available[0];
  const alternatives = available.slice(1, 3);
  const globalCooldownSeconds = state.globalMissionCooldownUntil ? Math.max(0, Math.floor((state.globalMissionCooldownUntil - now) / 1000)) : 0;
  const rawSelectedGuideMission = getGuideMission(state.guideMissionSelectedId);
  const rawCompletedGuideMission = getCompletedGuideMission(state);
  const selectedGuideMission = rawSelectedGuideMission ? localizeGuideMission(rawSelectedGuideMission, state.locale) : undefined;
  const completedGuideMission = rawCompletedGuideMission ? localizeGuideMission(rawCompletedGuideMission, state.locale) : undefined;
  const firstGuidePending = !state.firstGuideCompletedAt;
  const firstRealMissionPending = Boolean(completedGuideMission && !state.firstRealMissionStartedAt && !activeTechnology);
  const completedThisWeek = state.missionAttempts.filter((attempt) => attempt.completedAt && now - attempt.completedAt < 7 * 24 * 60 * 60 * 1000).length;
  const latestCompletedAttempt = [...state.missionAttempts].reverse().find((attempt) => attempt.completedAt);
  const latestCompletedTechnology = latestCompletedAttempt ? technologies.find((technology) => technology.id === latestCompletedAttempt.technologyId) : undefined;
  const nextMilestone = technologies.find((technology) => !state.completedTechnologyIds.includes(technology.id) && (technology.type === "milestone" || technology.type === "challenge") && getTechnologyLockReasons(technology, state).length === 0);

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



          {firstGuidePending ? (
            <Card className="border-primary/45 bg-primary/5">
              <CardHeader><CardTitle>{selectedGuideMission ? translate(state.locale, "Continue your first step") : translate(state.locale, "Choose your first step")}</CardTitle></CardHeader>
              <CardContent className="grid gap-3">
                {selectedGuideMission ? (
                  <div className="rounded-md border border-border bg-background/50 p-3">
                    <p className="font-black text-foreground">{translate(state.locale, selectedGuideMission.title)}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{selectedGuideMission.shortAction}</p>
                    <Button className="mt-3" asChild><Link href="/tree">{translate(state.locale, "Continue first step")} <ArrowRight size={16} /></Link></Button>
                  </div>
                ) : (
                  <div className="grid gap-2">
                    {guideMissions.map((rawMission) => { const mission = localizeGuideMission(rawMission, state.locale); return <div key={mission.id} className="rounded-md border border-border bg-background/50 p-3"><p className="font-bold text-foreground">{translate(state.locale, mission.title)}</p><p className="mt-1 text-xs text-muted-foreground">{mission.shortAction}</p></div>; })}
                    <Button asChild><Link href="/tree">{translate(state.locale, "Choose your first step")} <ArrowRight size={16} /></Link></Button>
                  </div>
                )}
                <p className="text-xs leading-5 text-muted-foreground">{translate(state.locale, "Guide step does not start cooldown. Cooldown appears later in real Life Tree missions so progress stays honest.")}</p>
              </CardContent>
            </Card>
          ) : null}

          {firstRealMissionPending && completedGuideMission ? (
            <Card className="border-primary/45 bg-primary/5">
              <CardHeader><CardTitle>{translate(state.locale, "Start your first real Life Tree mission")}</CardTitle></CardHeader>
              <CardContent className="grid gap-3">
                <p className="text-sm text-muted-foreground">{translate(state.locale, "Your progress has started")}. {translate(state.locale, "Next: open your first real mission")}</p>
                <Button asChild><Link href={`/tree?focus=${completedGuideMission.rootTechnologyId}`}>{translate(state.locale, "Start real tree mission")} <ArrowRight size={16} /></Link></Button>
              </CardContent>
            </Card>
          ) : null}

          {globalCooldownSeconds > 0 && !activeTechnology && !firstGuidePending ? (
            <Card className="border-primary/35 bg-primary/5">
              <CardHeader><CardTitle>{translate(state.locale, "What can I do now?")}</CardTitle></CardHeader>
              <CardContent className="grid gap-3 text-sm">
                <p className="font-bold text-foreground">{translate(state.locale, "You are not blocked.")}</p>
                <p className="text-muted-foreground">{translate(state.locale, "Global cooldown is a short recovery window before another focused mission. Personal cooldown means this exact branch rests.")}</p>
                <p className="text-xs font-black uppercase tracking-wide text-primary">{translate(state.locale, "Cooldown remaining")}: {formatDuration(globalCooldownSeconds)}</p>
                <div className="grid gap-2 rounded-md border border-border bg-background/50 p-3 text-xs leading-5 text-muted-foreground">
                  {latestCompletedTechnology ? <p><strong className="text-foreground">{translate(state.locale, "Review completed evidence")}:</strong> {localizeTechnology(latestCompletedTechnology, state.locale).title}</p> : null}
                  <p>{translate(state.locale, "Check profile progress, view achievements, prepare the next focus, or return later.")}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button asChild><Link href="/tree">{translate(state.locale, "Continue Tree")}</Link></Button>
                  <Button variant="outline" asChild><Link href="/profile">{translate(state.locale, "Review progress")}</Link></Button>
                </div>
              </CardContent>
            </Card>
          ) : null}

          {!firstGuidePending && !firstRealMissionPending && recommendation ? <Card><CardHeader><CardTitle>{translate(state.locale, "Recommended next mission")}</CardTitle></CardHeader><CardContent className="grid gap-3"><div><p className="font-black text-foreground">{localizeTechnology(recommendation, state.locale).title}</p><p className="mt-1 text-sm text-muted-foreground">{missionCopy(recommendation).concreteOutcome}</p></div><Button disabled={Boolean(activeTechnology) || globalCooldownSeconds > 0} onClick={() => startTechnologyMission(recommendation.id)}><Play size={16} />{globalCooldownSeconds > 0 ? `${translate(state.locale, "Cooldown")} ${formatDuration(globalCooldownSeconds)}` : translate(state.locale, "Start Mission")}</Button></CardContent></Card> : null}

          {!firstGuidePending && !firstRealMissionPending && alternatives.length ? <Card><CardHeader><CardTitle>{translate(state.locale, "Available alternatives")}</CardTitle></CardHeader><CardContent className="grid gap-2">{alternatives.map((technology) => <div key={technology.id} className="flex items-center justify-between gap-3 rounded-md border border-border bg-muted/30 p-3"><div className="min-w-0"><p className="font-bold text-foreground">{localizeTechnology(technology, state.locale).title}</p><p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{missionCopy(technology).concreteOutcome}</p></div><Button size="sm" variant="outline" disabled={Boolean(activeTechnology) || globalCooldownSeconds > 0} onClick={() => startTechnologyMission(technology.id)}><Play size={15} />{translate(state.locale, "Start")}</Button></div>)}</CardContent></Card> : null}
        </div>

        <div className="grid content-start gap-4">
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><CalendarCheck size={18} className="text-strategy-gold" />{translate(state.locale, "This week")}</CardTitle></CardHeader>
            <CardContent className="grid gap-3">
              <div className="rounded-md border border-border bg-muted/30 p-3">
                <p className="text-xs font-black uppercase tracking-wide text-muted-foreground">{translate(state.locale, "Completed missions")}</p>
                <p className="mt-1 text-3xl font-black text-foreground">{completedThisWeek}</p>
              </div>
              <div className="rounded-md border border-border bg-muted/30 p-3">
                <p className="text-xs font-black uppercase tracking-wide text-muted-foreground">{translate(state.locale, "Daily state")}</p>
                <p className="mt-1 text-sm font-bold text-foreground">{activeTechnology ? translate(state.locale, "One active mission is waiting for completion.") : globalCooldownSeconds > 0 ? translate(state.locale, "Recovery cooldown is active. You can review progress or prepare the next focus.") : translate(state.locale, "Ready for one focused mission.")}</p>
              </div>
              <div className="rounded-md border border-border bg-muted/30 p-3">
                <p className="text-xs font-black uppercase tracking-wide text-muted-foreground">{translate(state.locale, "Weekly state")}</p>
                <p className="mt-1 text-sm text-muted-foreground">{translate(state.locale, "Progress is based on completed Mission Attempts, not a separate planner.")}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Flag size={18} className="text-primary" />{translate(state.locale, "Nearest milestone")}</CardTitle></CardHeader>
            <CardContent>
              {nextMilestone ? <><p className="font-black text-foreground">{localizeTechnology(nextMilestone, state.locale).title}</p><p className="mt-1 text-sm text-muted-foreground">{localizeTechnology(nextMilestone, state.locale).description}</p></> : <p className="text-sm text-muted-foreground">{translate(state.locale, "Keep completing branch missions to reveal the next milestone or Trial.")}</p>}
            </CardContent>
          </Card>
        </div>
      </section>
    </AppShell>
  );
}
