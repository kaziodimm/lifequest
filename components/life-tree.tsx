"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { LucideIcon } from "lucide-react";
import { Brain, BriefcaseBusiness, Check, Clock3, HeartPulse, Landmark, LocateFixed, Lock, Minus, Palette, Play, Plus, Rocket, ShieldAlert, Sparkles, Timer, Users } from "lucide-react";
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

const treeSize = 2200;
const corePoint = { x: treeSize / 2, y: treeSize / 2 };
const nodeCenterOffset = { x: 64, y: 40 };

const radialBranches: Record<LifeCategory, { angle: number; label: string }> = {
  health: { angle: -92, label: "Body systems" },
  mind: { angle: -42, label: "Cognition" },
  business: { angle: 8, label: "Builder path" },
  career: { angle: 58, label: "Direction" },
  finance: { angle: 118, label: "Resources" },
  relationships: { angle: 178, label: "Alliances" },
  creativity: { angle: -152, label: "Artifacts" }
};

function getStatus(tech: LifeTechnology, completedIds: string[], runtimeStatus?: string, runtimeProgress = 0): TechStatus {
  if (completedIds.includes(tech.id)) return "unlocked";
  if (!tech.parents.every((parentId) => completedIds.includes(parentId))) return "locked";
  if (runtimeStatus === "active" || runtimeStatus === "cooldown" || runtimeProgress > 0) return "in_progress";
  return "available";
}

function getTechnologyDepth(tech: LifeTechnology, byId: Map<string, LifeTechnology>, seen = new Set<string>()): number {
  if (!tech.parents.length || seen.has(tech.id)) return 0;
  seen.add(tech.id);
  return 1 + Math.max(...tech.parents.map((parentId) => {
    const parent = byId.get(parentId);
    return parent ? getTechnologyDepth(parent, byId, new Set(seen)) : 0;
  }));
}

function createRadialPositions() {
  const byId = new Map(technologies.map((tech) => [tech.id, tech]));
  const depthById = new Map<string, number>();
  const groups = new Map<string, LifeTechnology[]>();

  technologies.forEach((tech) => {
    const depth = getTechnologyDepth(tech, byId);
    depthById.set(tech.id, depth);
    const key = `${tech.category}-${depth}`;
    groups.set(key, [...(groups.get(key) ?? []), tech]);
  });

  const positions: Record<string, { x: number; y: number; depth: number }> = {};

  technologies.forEach((tech) => {
    const depth = depthById.get(tech.id) ?? 0;
    const group = groups.get(`${tech.category}-${depth}`) ?? [tech];
    const index = group.findIndex((item) => item.id === tech.id);
    const branch = radialBranches[tech.category];
    const angle = (branch.angle + depth * 3) * (Math.PI / 180);
    const radius = 260 + depth * 260;
    const spread = Math.min(190, 82 + depth * 34);
    const siblingOffset = (index - (group.length - 1) / 2) * spread;
    const perpendicular = angle + Math.PI / 2;

    positions[tech.id] = {
      x: corePoint.x + Math.cos(angle) * radius + Math.cos(perpendicular) * siblingOffset - nodeCenterOffset.x,
      y: corePoint.y + Math.sin(angle) * radius + Math.sin(perpendicular) * siblingOffset - nodeCenterOffset.y,
      depth
    };
  });

  return positions;
}

const radialPositions = createRadialPositions();

function getNodePoint(tech: LifeTechnology) {
  const position = radialPositions[tech.id] ?? { x: tech.x, y: tech.y };
  return { x: position.x + nodeCenterOffset.x, y: position.y + nodeCenterOffset.y };
}

function getConnectionPath(start: { x: number; y: number }, end: { x: number; y: number }) {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const distance = Math.hypot(dx, dy);
  const curve = Math.min(160, Math.max(70, distance * 0.22));
  const normalX = -dy / distance || 0;
  const normalY = dx / distance || 0;

  return `M ${start.x} ${start.y} C ${start.x + dx * 0.28 + normalX * curve} ${start.y + dy * 0.28 + normalY * curve}, ${end.x - dx * 0.28 + normalX * curve} ${end.y - dy * 0.28 + normalY * curve}, ${end.x} ${end.y}`;
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
    <aside className="mission-panel life-tree-panel border border-border bg-card/95 p-4 backdrop-blur" onPointerDown={(event) => event.stopPropagation()}>
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
  const [selectedId, setSelectedId] = useState(() => technologies[0]?.id);
  const [now, setNow] = useState(() => Date.now());
  const [zoom, setZoom] = useState(0.72);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [dragStart, setDragStart] = useState<{ pointerId: number; x: number; y: number; panX: number; panY: number } | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const completedIds = useLifeStore((state) => state.completedTechnologyIds);
  const technologyRuntime = useLifeStore((state) => state.technologyRuntime);
  const selectedTechnology = useMemo(() => technologies.find((tech) => tech.id === selectedId) ?? technologies[0], [selectedId]);
  const rootTechnologies = useMemo(() => technologies.filter((tech) => tech.parents.length === 0), []);

  useEffect(() => {
    const interval = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(interval);
  }, []);

  function resetView() {
    setZoom(0.72);
    setPan({ x: 0, y: 0 });
  }

  function handlePointerDown(event: React.PointerEvent<HTMLDivElement>) {
    if (event.button !== 0) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    setDragStart({ pointerId: event.pointerId, x: event.clientX, y: event.clientY, panX: pan.x, panY: pan.y });
  }

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (!dragStart || dragStart.pointerId !== event.pointerId) return;
    setPan({ x: dragStart.panX + event.clientX - dragStart.x, y: dragStart.panY + event.clientY - dragStart.y });
  }

  function handlePointerUp(event: React.PointerEvent<HTMLDivElement>) {
    if (dragStart?.pointerId === event.pointerId) setDragStart(null);
  }

  return (
    <div className="life-tree-shell">
      <div className="life-tree-toolbar">
        <div className="flex min-w-0 items-center gap-2 overflow-x-auto">
          {Object.entries(categoryLabels).map(([id, label]) => {
            const category = id as LifeCategory;
            const Icon = categoryIcons[category];
            const color = categoryColors[category];

            return (
              <button
                key={id}
                type="button"
                className="shrink-0 rounded-full border border-border bg-background/55 px-3 py-2 text-xs font-black transition hover:border-primary/50"
                style={{ color, boxShadow: `inset 0 0 18px ${color}14` }}
                onClick={() => {
                  const root = technologies.find((tech) => tech.category === category && tech.parents.length === 0);
                  if (root) setSelectedId(root.id);
                }}
              >
                <span className="flex items-center gap-2"><Icon size={14} />{label}</span>
              </button>
            );
          })}
        </div>

        <div className="flex shrink-0 items-center gap-1 rounded-full border border-border bg-background/70 p-1 backdrop-blur">
          <button type="button" className="tree-tool-button" aria-label="Zoom out" onClick={() => setZoom((value) => Math.max(0.48, value - 0.1))}><Minus size={16} /></button>
          <span className="w-12 text-center text-[11px] font-black text-muted-foreground">{Math.round(zoom * 100)}%</span>
          <button type="button" className="tree-tool-button" aria-label="Zoom in" onClick={() => setZoom((value) => Math.min(1.35, value + 0.1))}><Plus size={16} /></button>
          <button type="button" className="tree-tool-button" aria-label="Center tree" onClick={resetView}><LocateFixed size={16} /></button>
        </div>
      </div>

      <div
        ref={stageRef}
        className={cn("life-tree-stage", dragStart && "is-dragging")}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <div className="life-tree-vignette" />
        <div className="life-tree-starfield" />

        <div
          className="life-tree-canvas"
          style={{ width: treeSize, height: treeSize, transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})` }}
        >
          {Object.entries(radialBranches).map(([id, branch]) => {
            const category = id as LifeCategory;
            const color = categoryColors[category];
            const angle = branch.angle * (Math.PI / 180);
            const x = corePoint.x + Math.cos(angle) * 520;
            const y = corePoint.y + Math.sin(angle) * 520;

            return (
              <div key={id} className="branch-label" style={{ left: x, top: y, color, borderColor: `${color}30`, background: `${color}0f` }}>
                {branch.label}
              </div>
            );
          })}

          <svg className="pointer-events-none absolute inset-0 size-full" viewBox={`0 0 ${treeSize} ${treeSize}`} aria-hidden="true">
            <defs>
              <filter id="connectionGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
              <radialGradient id="coreAura" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="rgba(246, 196, 83, 0.3)" />
                <stop offset="45%" stopColor="rgba(76, 224, 210, 0.12)" />
                <stop offset="100%" stopColor="rgba(76, 224, 210, 0)" />
              </radialGradient>
            </defs>
            <circle cx={corePoint.x} cy={corePoint.y} r="360" fill="url(#coreAura)" />
            <circle cx={corePoint.x} cy={corePoint.y} r="250" fill="none" stroke="rgba(255,255,255,0.06)" strokeDasharray="3 18" />
            <circle cx={corePoint.x} cy={corePoint.y} r="520" fill="none" stroke="rgba(255,255,255,0.045)" strokeDasharray="2 22" />
            <circle cx={corePoint.x} cy={corePoint.y} r="790" fill="none" stroke="rgba(255,255,255,0.035)" strokeDasharray="2 26" />

            {rootTechnologies.map((tech) => {
              const runtime = technologyRuntime[tech.id];
              const status = getStatus(tech, completedIds, runtime?.status, runtime?.progress);
              const color = categoryColors[tech.category];
              const end = getNodePoint(tech);

              return (
                <path
                  key={`core-${tech.id}`}
                  d={getConnectionPath(corePoint, end)}
                  fill="none"
                  stroke={status === "locked" ? "rgba(148, 163, 184, 0.16)" : `${color}88`}
                  strokeWidth={status === "locked" ? 2 : 3}
                  strokeDasharray={status === "unlocked" ? "0" : "8 12"}
                  strokeLinecap="round"
                  filter={status !== "locked" ? "url(#connectionGlow)" : undefined}
                />
              );
            })}

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
                    d={getConnectionPath(getNodePoint(parent), getNodePoint(tech))}
                    fill="none"
                    stroke={status === "unlocked" ? color : status === "available" || status === "in_progress" ? `${color}AA` : "rgba(148, 163, 184, 0.16)"}
                    strokeWidth={status === "unlocked" ? 4 : status === "available" || status === "in_progress" ? 3 : 2}
                    strokeDasharray={status === "unlocked" ? "0" : status === "available" || status === "in_progress" ? "10 10" : "5 14"}
                    strokeLinecap="round"
                    filter={status !== "locked" ? "url(#connectionGlow)" : undefined}
                  />
                );
              })
            )}
          </svg>

          <button
            type="button"
            className="life-core-node"
            style={{ left: corePoint.x - 74, top: corePoint.y - 74 }}
            onPointerDown={(event) => event.stopPropagation()}
            onClick={() => setSelectedId(rootTechnologies[0]?.id ?? technologies[0]?.id)}
          >
            <span className="text-[10px] font-black uppercase tracking-[0.28em] text-accent">Habidoo</span>
            <span className="mt-1 text-lg font-black text-foreground">Life Core</span>
            <span className="mt-1 text-[10px] font-bold text-muted-foreground">Foundation Era</span>
          </button>

          {technologies.map((tech) => {
            const runtime = technologyRuntime[tech.id];
            const status = getStatus(tech, completedIds, runtime?.status, runtime?.progress);
            const color = categoryColors[tech.category];
            const Icon = categoryIcons[tech.category];
            const isSelected = selectedTechnology.id === tech.id;
            const cooldownActive = runtime?.cooldownUntil ? runtime.cooldownUntil > now : false;
            const position = radialPositions[tech.id] ?? { x: tech.x, y: tech.y };

            return (
              <button
                key={tech.id}
                type="button"
                className={cn("tech-node-button radial-tech-node absolute flex w-32 flex-col items-center gap-2 text-center transition", status, isSelected && "selected")}
                style={{ left: position.x, top: position.y, ["--node-color" as string]: color }}
                onPointerDown={(event) => event.stopPropagation()}
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
