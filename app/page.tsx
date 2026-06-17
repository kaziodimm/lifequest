"use client";

import Link from "next/link";
import { ArrowRight, Flame, Gauge, GitBranch, Sparkles, Zap } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { categoryProgress, nextStrategicRecommendation } from "@/lib/insights";
import { categoryColors } from "@/lib/life-tree";
import { dailyCompletionPercent, levelFromXp } from "@/lib/progression";
import { useLifeStore } from "@/lib/store";

export default function HomePage() {
  const state = useLifeStore();
  const level = levelFromXp(state.totalXp);
  const completion = dailyCompletionPercent(state);
  const recommendation = nextStrategicRecommendation(state);
  const categories = categoryProgress(state);

  return (
    <AppShell>
      <section className="mb-5 rounded-lg border border-primary/30 bg-card/70 p-5 shadow-node backdrop-blur">
        <p className="mb-2 text-xs font-bold uppercase tracking-wide text-primary">Life Strategy Command</p>
        <h1 className="text-3xl font-black tracking-tight text-foreground">Develop your real life like a tech tree.</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">No todo chaos. Pick today's missions, progress the Life Tree, and unlock technologies that represent real upgrades.</p>
        <Button asChild className="mt-5">
          <Link href="/tree">Open Life Tree <ArrowRight size={17} /></Link>
        </Button>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Sparkles size={17} className="text-primary" />Level {level.level}</CardTitle></CardHeader>
          <CardContent><Progress value={level.progress} /><p className="mt-2 text-xs text-muted-foreground">{level.current}/{level.needed} XP to next level</p></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Zap size={17} className="text-strategy-gold" />Total XP</CardTitle></CardHeader>
          <CardContent><p className="text-3xl font-black">{state.totalXp}</p></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Flame size={17} className="text-strategy-red" />Streak</CardTitle></CardHeader>
          <CardContent><p className="text-3xl font-black">{state.streak} days</p></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Gauge size={17} className="text-strategy-green" />Today</CardTitle></CardHeader>
          <CardContent><p className="text-3xl font-black">{completion}%</p></CardContent>
        </Card>
      </section>

      <section className="mt-5 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <CardHeader><CardTitle>Today's Top Missions</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {state.dailyMissions.map((mission) => (
              <div key={mission.id} className="rounded-md border border-border bg-muted/45 p-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-bold text-foreground">{mission.title}</p>
                    <p className="mt-1 text-xs text-muted-foreground">Tiny start: {mission.tinyStep}</p>
                  </div>
                  <span className="rounded-md bg-primary/15 px-2 py-1 text-xs font-bold text-primary">+{mission.xpReward} XP</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
        <div className="grid gap-4">
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><GitBranch size={17} className="text-primary" />Strategic Recommendation</CardTitle></CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p className="text-base font-bold text-foreground">{recommendation.title}</p>
              <p>{recommendation.description}</p>
              <Button asChild variant="outline" size="sm"><Link href="/tree">Inspect Tree <ArrowRight size={15} /></Link></Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Life Domains</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {categories.map((item) => (
                <div key={item.category}>
                  <div className="mb-1 flex justify-between text-xs">
                    <span className="font-bold" style={{ color: categoryColors[item.category as keyof typeof categoryColors] }}>{item.label}</span>
                    <span className="text-muted-foreground">{item.unlocked}/{item.total}</span>
                  </div>
                  <Progress value={item.percent} />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </section>
    </AppShell>
  );
}
