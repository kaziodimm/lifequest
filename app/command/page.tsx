"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Clock, Play, Target } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { technologies } from "@/lib/life-tree";
import { useLifeStore } from "@/lib/store";
import { cn } from "@/lib/utils";

function formatDuration(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export default function CommandPage() {
  const [now, setNow] = useState(() => Date.now());
  const missions = useLifeStore((state) => state.dailyMissions);
  const startMission = useLifeStore((state) => state.startMission);
  const completeMission = useLifeStore((state) => state.completeMission);
  const planner = useLifeStore((state) => state.planner);
  const updatePlannerBlock = useLifeStore((state) => state.updatePlannerBlock);
  const togglePlannerBlock = useLifeStore((state) => state.togglePlannerBlock);

  useEffect(() => {
    const interval = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(interval);
  }, []);

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
              const status = mission.completed ? "completed" : mission.status ?? "ready";
              const elapsedSeconds = status === "active" && mission.startedAt ? Math.max(0, Math.floor((now - mission.startedAt) / 1000)) : 0;
              const remainingSeconds = Math.max(0, mission.minDurationSeconds - elapsedSeconds);
              const canComplete = status === "active" && remainingSeconds === 0;

              return (
                <div key={mission.id} className={cn("rounded-lg border p-3 transition", status === "active" ? "border-primary/70 bg-primary/10 shadow-[0_0_24px_rgba(132,255,170,0.12)]" : "border-border bg-muted/40")}> 
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="mb-2 flex flex-wrap items-center gap-2">
                        <p className="font-bold text-foreground">{mission.title}</p>
                        <span className={cn("rounded-full border px-2 py-0.5 text-[10px] font-black uppercase tracking-wide", status === "active" ? "border-primary/50 text-primary" : "border-border text-muted-foreground")}>{status}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">Tiny start: {mission.tinyStep}</p>
                      <p className="mt-2 text-xs font-semibold text-primary">Progresses: {tech?.title ?? "Life Tree"}</p>
                      {status === "active" ? (
                        <p className="mt-2 text-xs font-bold text-strategy-gold">Research timer: {formatDuration(elapsedSeconds)} / {formatDuration(mission.minDurationSeconds)}</p>
                      ) : null}
                    </div>
                    {status === "completed" ? (
                      <Button size="sm" variant="secondary" disabled>
                        <CheckCircle2 size={16} />Done
                      </Button>
                    ) : status === "active" ? (
                      <Button size="sm" onClick={() => completeMission(mission.id)} disabled={!canComplete}>
                        <CheckCircle2 size={16} />{canComplete ? "Complete" : formatDuration(remainingSeconds)}
                      </Button>
                    ) : (
                      <Button size="sm" onClick={() => startMission(mission.id)}>
                        <Play size={16} />Start
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Clock size={18} className="text-strategy-gold" />24h Planner</CardTitle></CardHeader>
          <CardContent className="grid max-h-[620px] gap-2 overflow-auto">
            {planner.map((block) => (
              <div key={block.hour} className={cn("grid gap-2 rounded-md border bg-muted/30 p-3 sm:grid-cols-[56px_1fr_190px_44px] sm:items-center", block.completed ? "border-primary/60 bg-primary/10" : "border-border")}>
                <span className="text-xs font-black text-primary">{String(block.hour).padStart(2, "0")}:00</span>
                <input
                  className="h-10 rounded-md border border-border bg-background/60 px-3 text-sm outline-none transition placeholder:text-muted-foreground focus:border-primary"
                  value={block.plan}
                  placeholder="Assign a real-world action"
                  onChange={(event) => updatePlannerBlock(block.hour, event.target.value, block.technologyId)}
                />
                <select
                  className="h-10 rounded-md border border-border bg-background/60 px-3 text-sm outline-none transition focus:border-primary"
                  value={block.technologyId ?? ""}
                  onChange={(event) => updatePlannerBlock(block.hour, block.plan, event.target.value || undefined)}
                >
                  <option value="">No technology</option>
                  {technologies.map((tech) => (
                    <option key={tech.id} value={tech.id}>{tech.title}</option>
                  ))}
                </select>
                <Button size="icon" variant={block.completed ? "default" : "outline"} onClick={() => togglePlannerBlock(block.hour)}>
                  <CheckCircle2 size={17} />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </AppShell>
  );
}
