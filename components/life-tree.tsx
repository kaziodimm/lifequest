"use client";

import { useEffect, useMemo, useState } from "react";
import type { LucideIcon } from "lucide-react";
import { Brain, BriefcaseBusiness, Check, Clock3, HeartPulse, Landmark, Lock, Palette, Play, Rocket, ShieldAlert, Sparkles, Timer, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { lifeEras } from "@/lib/eras";
import { technologies, categoryColors, categoryLabels } from "@/lib/life-tree";
import { getTechnologyMission, getTechnologyTarget } from "@/lib/missions";
import { useLifeStore } from "@/lib/store";
import type { LifeCategory, LifeTechnology, TechStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

const categoryIcons: Record<LifeCategory, LucideIcon> = {
  health: HeartPulse,
  mind: Brain,
  career: BriefcaseBusiness,
  business: Rocket,
  finance: Landmark,
  relationships: Users,
  creativity: Palette
};

const categoryBands: Array<{ id: LifeCategory; y: number; height: number }> = [
  { id: "health", y: 12, height: 330 },
  { id: "mind", y: 370, height: 330 },
  { id: "business", y: 730, height: 330 },
  { id: "career", y: 1080, height: 330 },
  { id: "finance", y: 1430, height: 330 },
  { id: "relationships", y: 1810, height: 250 },
  { id: "creativity", y: 2160, height: 250 }
];

function getStatus(tech: LifeTechnology, completedIds: string[], runtimeStatus?: string, runtimeProgress = 0): TechStatus {
  if (completedIds.includes(tech.id)) return "unlocked";
  if (!tech.parents.every((parentId) => completedIds.includes(parentId))) return "locked";
  if (runtimeStatus === "active" || runtimeStatus === "cooldown" || runtimeProgress > 0) return "in_progress";
  return "available";
}

function getConnectionPath(parentX: number, parentY: number, childX: number, childY: number) {
  const startX = parentX + 48;
  const startY = parentY + 48;
  const endX = childX + 48;
  const endY = childY + 48;
  const controlOffset = Math.max(90, Math.abs(endX - startX) * 0.45);

  return `M ${startX} ${startY} C ${startX + controlOffset} ${startY}, ${endX - controlOffset} ${endY}, ${endX} ${endY}`;
}

function formatDuration(totalSeconds: number) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) return `${hours}h ${String(minutes).padStart(2, "0")}m`;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function getEraTitle(technology: LifeTechnology) {
  return lifeEras.find((era) => era.id === (technology.era ?? "foundation"))?.title ?? "Foundation";
}

function MissionPanel({ technology, now }: { technology: LifeTechnology; now: number }) {
  const runtime = useLifeStore((state) => state.technologyRuntime[technology.id]);
  const completedIds = useLifeStore((state) => state.completedTechnologyIds);
  const startTechnologyMission = useLifeStore((state) => state.startTechnologyMission);
  const completeTechnologyMission = useLifeStore((state) => state.completeTechnologyMission);
  const mission = getTechnologyMission(technology);
  const target = getTechnologyTarget(technology);
  const progress = runtime?.progress ?? technology.requirements[0]?.current ?? 0;
  const progressPercent = Math.min(100, (progress / target) * 100);
  const status = getStatus(technology, completedIds, runtime?.status, progress);
  const elapsedSeconds = runtime?.status === "active" && runtime.startedAt ? Math.max(0, Math.floor((now - runtime.startedAt) / 1000)) : 0;
  const remainingSeconds = Math.max(0, mission.minDurationSeconds - elapsedSeconds);
  const cooldownRemaining = runtime?.cooldownUntil ? Math.max(0, Math.floor((runtime.cooldownUntil - now) / 1000)) : 0;
  const canComplete = runtime?.status === "active" && remainingSeconds === 0;
  const nextUnlocks = technology.unlocks.map((id) => technologies.find((item) => item.id === id)?.title).filter(Boolean);
  const color = categoryColors[technology.category];
  const Icon = categoryIcons[technology.category];

  return (
    <aside className="mission-panel border-t border-border bg-card/95 p-4 backdrop-blur lg:absolute lg:right-4 lg:top-4 lg:z-30 lg:w-[360px] lg:rounded-lg lg:border">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-black uppercase tracking-wide" style={{ color }}>{categoryLabels[technology.category]} / {getEraTitle(technology)}</p>
          <h2 className="mt-1 text-xl font-black text-foreground">{technology.title}</h2>
        </div>
        <div className="grid size-11 place-items-center rounded-full border bg-muted/60" style={{ color, borderColor: `${color}66` }}>
          <Icon size={20} />
        </div>
      </div>

      <p className="text-sm leading-6 text-muted-foreground">{technology.description}</p>

      <div className="mt-4 rounded-md border border-border bg-background/45 p-3">
        <div className="mb-2 flex items-center justify-between text-xs font-bold">
          <span>Research progress</span>
          <span style={{ color }}>{progress}/{target}</span>
        </div>
        <Progress value={progressPercent} />
        <p className="mt-2 text-xs text-muted-foreground">{technology.requirements[0]?.label ?? "Complete real-world mission"}</p>
      </div>

      <div className="mt-4 grid gap-2 text-sm">
        <div className="rounded-md border border-border bg-muted/35 p-3">
          <p className="mb-1 flex items-center gap-2 text-xs font-black uppercase tracking-wide text-primary"><Sparkles size={14} /> What do I do now?</p>
          <p className="text-foreground">{mission.action}</p>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-md border border-border bg-muted/35 p-3">
            <p className="mb-1 flex items-center gap-2 text-xs font-black uppercase tracking-wide text-muted-foreground"><Timer size={14} /> Duration</p>
            <p className="font-bold text-foreground">{mission.durationLabel}</p>
          </div>
          <div className="rounded-md border border-border bg-muted/35 p-3">
            <p className="mb-1 flex items-center gap-2 text-xs font-black uppercase tracking-wide text-muted-foreground"><Clock3 size={14} /> Cooldown</p>
            <p className="font-bold text-foreground">{formatDuration(mission.cooldownSeconds)}</p>
          </div>
        </div>
      </div>

      <div className="mt-4 rounded-md border border-border bg-background/45 p-3">
        <p className="mb-2 text-xs font-black uppercase tracking-wide text-muted-foreground">Next unlock</p>
        <p className="text-sm font-bold text-foreground">{nextUnlocks.length ? nextUnlocks.join(", ") : "Branch mastery"}</p>
      </div>

      {status === "locked" ? (
        <div className="mt-4 flex items-start gap-2 rounded-md border border-border bg-muted/35 p-3 text-xs text-muted-foreground">
          <ShieldAlert size={16} className="mt-0.5 shrink-0" /> Unlock parent technologies first.
        </div>
      ) : runtime?.status === "active" ? (
        <Button className="mt-4 w-full" disabled={!canComplete} onClick={() => completeTechnologyMission(technology.id)}>
          <Check size={16} /> {canComplete ? "Complete Mission" : `Keep going ${formatDuration(remainingSeconds)}`}
        </Button>
      ) : cooldownRemaining > 0 ? (
        <Button className="mt-4 w-full" disabled variant="outline">
          <Clock3 size={16} /> Cooldown {formatDuration(cooldownRemaining)}
        </Button>
      ) : status === "unlocked" ? (
        <Button className="mt-4 w-full" disabled variant="secondary">
          <Check size={16} /> Technology completed
        </Button>
      ) : (
        <Button className="mt-4 w-full" onClick={() => startTechnologyMission(technology.id)}>
          <Play size={16} /> Start Mission
        </Button>
      )}
    </aside>
  );
}

export function LifeTree() {
  const [selectedId, setSelectedId] = useState(() => technologies[1]?.id ?? technologies[0]?.id);
  const [now, setNow] = useState(() => Date.now());
  const completedIds = useLifeStore((state) => state.completedTechnologyIds);
  const technologyRuntime = useLifeStore((state) => state.technologyRuntime);
  const selectedTechnology = useMemo(() => technologies.find((tech) => tech.id === selectedId) ?? technologies[0], [selectedId]);

  useEffect(() => {
    const interval = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(interval);
  }, []);

  return (
    <div className="strategy-panel overflow-hidden">
      <div className="flex gap-2 overflow-x-auto border-b border-border bg-background/35 p-3">
        {Object.entries(categoryLabels).map(([id, label]) => {
          const category = id as LifeCategory;
          const Icon = categoryIcons[category];
          const color = categoryColors[category];

          return (
            <div key={id} className="shrink-0 rounded-md border border-border bg-muted/40 px-3 py-2 text-xs font-bold" style={{ color, boxShadow: `inset 0 0 18px ${color}18` }}>
              <span className="flex items-center gap-2"><Icon size={14} />{label}</span>
            </div>
          );
        })}
      </div>

      <div className="strategy-grid life-map-bg relative h-[72vh] min-h-[660px] overflow-auto lg:pr-[390px]">
        <div className="relative h-[2520px] w-[1500px] p-4">
          {categoryBands.map((band) => {
            const color = categoryColors[band.id];
            const Icon = categoryIcons[band.id];

            return (
              <div key={band.id} className="pointer-events-none absolute left-0 rounded-lg border border-dashed px-5 py-4" style={{ top: band.y, width: 1440, height: band.height, borderColor: `${color}22`, background: `linear-gradient(90deg, ${color}12, transparent 38%, ${color}08)` }}>
                <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.18em]" style={{ color }}>
                  <Icon size={15} />{categoryLabels[band.id]} sector
                </div>
              </div>
            );
          })}

          <svg className="pointer-events-none absolute inset-0 size-full" aria-hidden="true">
            <defs>
              <filter id="connectionGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            </defs>
            {technologies.flatMap((tech) =>
              tech.parents.map((parentId) => {
                const parent = technologies.find((item) => item.id === parentId);
                if (!parent) return null;

                const runtime = technologyRuntime[tech.id];
                const status = getStatus(tech, completedIds, runtime?.status, runtime?.progress);
                const color = categoryColors[tech.category];

                return (
                  <path
                    key={`${parentId}-${tech.id}`}
                    d={getConnectionPath(parent.x, parent.y, tech.x, tech.y)}
                    fill="none"
                    stroke={status === "unlocked" ? color : status === "available" || status === "in_progress" ? `${color}AA` : "rgba(148, 163, 184, 0.18)"}
                    strokeWidth={status === "unlocked" ? 4 : status === "available" || status === "in_progress" ? 3 : 2}
                    strokeDasharray={status === "unlocked" ? "0" : status === "available" || status === "in_progress" ? "10 10" : "5 12"}
                    strokeLinecap="round"
                    filter={status !== "locked" ? "url(#connectionGlow)" : undefined}
                  />
                );
              })
            )}
          </svg>

          {technologies.map((tech) => {
            const runtime = technologyRuntime[tech.id];
            const status = getStatus(tech, completedIds, runtime?.status, runtime?.progress);
            const color = categoryColors[tech.category];
            const Icon = categoryIcons[tech.category];
            const isSelected = selectedTechnology.id === tech.id;
            const cooldownActive = runtime?.cooldownUntil ? runtime.cooldownUntil > now : false;

            return (
              <button
                key={tech.id}
                type="button"
                className={cn("tech-node-button absolute flex w-32 flex-col items-center gap-2 text-center transition", status, isSelected && "selected")}
                style={{ left: tech.x, top: tech.y, ["--node-color" as string]: color }}
                onClick={() => setSelectedId(tech.id)}
              >
                <span className="tech-orb grid size-20 place-items-center rounded-full border bg-card/95 backdrop-blur">
                  {status === "locked" ? <Lock size={24} /> : status === "unlocked" ? <Check size={26} /> : <Icon size={25} />}
                  {runtime?.status === "active" ? <span className="absolute -right-1 -top-1 size-4 rounded-full bg-primary shadow-node" /> : null}
                  {cooldownActive ? <span className="absolute -bottom-1 -right-1 grid size-5 place-items-center rounded-full border border-border bg-background text-[9px]">cd</span> : null}
                </span>
                <span className="line-clamp-2 text-[11px] font-black leading-tight text-foreground">{tech.title}</span>
              </button>
            );
          })}
        </div>
        <MissionPanel technology={selectedTechnology} now={now} />
      </div>
    </div>
  );
}
