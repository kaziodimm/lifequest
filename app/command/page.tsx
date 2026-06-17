"use client";

import { CheckCircle2, Clock, Target } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { technologies } from "@/lib/life-tree";
import { useLifeStore } from "@/lib/store";

export default function CommandPage() {
  const missions = useLifeStore((state) => state.dailyMissions);
  const completeMission = useLifeStore((state) => state.completeMission);
  const planner = useLifeStore((state) => state.planner);

  return (
    <AppShell>
      <div className="mb-4">
        <p className="mb-2 text-xs font-bold uppercase tracking-wide text-primary">Morning System</p>
        <h1 className="text-2xl font-black text-foreground">Daily Command Center</h1>
        <p className="mt-2 text-sm text-muted-foreground">Every mission should answer: what to do, what technology it progresses, and why it matters.</p>
      </div>

      <section className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Target size={18} className="text-primary" />Top 3 Missions</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {missions.map((mission) => {
              const tech = technologies.find((item) => item.id === mission.technologyId);
              return (
                <div key={mission.id} className="rounded-lg border border-border bg-muted/40 p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-bold text-foreground">{mission.title}</p>
                      <p className="mt-1 text-xs text-muted-foreground">Tiny start: {mission.tinyStep}</p>
                      <p className="mt-2 text-xs font-semibold text-primary">Progresses: {tech?.title ?? "Life Tree"}</p>
                    </div>
                    <Button size="sm" variant={mission.completed ? "secondary" : "default"} onClick={() => completeMission(mission.id)} disabled={mission.completed}>
                      <CheckCircle2 size={16} />{mission.completed ? "Done" : `+${mission.xpReward}`}
                    </Button>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Clock size={18} className="text-strategy-gold" />24h Planner</CardTitle></CardHeader>
          <CardContent className="grid max-h-[560px] gap-2 overflow-auto">
            {planner.map((block) => (
              <div key={block.hour} className="grid grid-cols-[56px_1fr] items-center gap-3 rounded-md border border-border bg-muted/30 px-3 py-2">
                <span className="text-xs font-black text-primary">{String(block.hour).padStart(2, "0")}:00</span>
                <span className="text-sm text-muted-foreground">{block.plan || "Assign a mission later"}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </AppShell>
  );
}
