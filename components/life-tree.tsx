"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { ComponentType, PointerEvent, WheelEvent } from "react";
import { Check, Clock3, LocateFixed, Lock, Play, ShieldAlert, Sparkles, Timer, X as CloseIcon } from "lucide-react";
import { CategoryGlyph } from "@/components/tree-glyphs";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { lifeEras } from "@/lib/eras";
import { technologies, categoryColors, categoryLabels } from "@/lib/life-tree";
import { getTechnologyMission, getTechnologyTarget } from "@/lib/missions";
import { useLifeStore } from "@/lib/store";
import type { LifeCategory, LifeTechnology, TechStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

type CategoryIconProps = { size?: number; className?: string };
type CategoryIcon = ComponentType<CategoryIconProps>;

function makeCategoryIcon(category: LifeCategory): CategoryIcon {
  function LifeTreeCategoryIcon(props: CategoryIconProps) {
    return <CategoryGlyph category={category} {...props} />;
  }

  LifeTreeCategoryIcon.displayName = `LifeTreeCategoryIcon.${category}`;
  return LifeTreeCategoryIcon;
}

const categoryIcons: Record<LifeCategory, CategoryIcon> = {
  health: makeCategoryIcon("health"),
  mind: makeCategoryIcon("mind"),
  career: makeCategoryIcon("career"),
  business: makeCategoryIcon("business"),
  finance: makeCategoryIcon("finance"),
  relationships: makeCategoryIcon("relationships"),
  creativity: makeCategoryIcon("creativity")
};

const treeSize = 4200;
const corePoint = { x: treeSize / 2, y: treeSize / 2 };
const nodeCenterOffset = { x: 64, y: 46 };
const overviewZoom = 0.54;
const focusZoom = 1.06;
const minZoom = 0.34;
const maxZoom = 1.38;

type ViewState = { zoom: number; pan: { x: number; y: number } };
type PanelAnchor = { x: number; y: number };

const epochs = Array.from({ length: 12 }, (_, index) => ({
  id: index + 1,
  title: `Epoch ${String(index + 1).padStart(2, "0")}`,
  duration: "1 month",
  unlocked: index === 0
}));

const radialBranches: Record<LifeCategory, { angle: number; label: string; description: string }> = {
  health: { angle: -92, label: "Body & Energy", description: "Strength, sleep and recovery" },
  mind: { angle: -42, label: "Focus & Mind", description: "Clarity, learning and resilience" },
  business: { angle: 8, label: "Build & Create", description: "Turn ideas into useful systems" },
  career: { angle: 58, label: "Direction & Career", description: "Skills, contribution and growth" },
  finance: { angle: 118, label: "Money & Freedom", description: "Stability, choice and resources" },
  relationships: { angle: 178, label: "People & Connection", description: "Trust, community and support" },
  creativity: { angle: -152, label: "Creative Practice", description: "Expression, play and craft" }
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

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
    const angle = (branch.angle + depth * 2) * (Math.PI / 180);
    const radius = 380 + depth * 390;
    const spread = Math.min(250, 110 + depth * 48);
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

function getBranchJoint(start: { x: number; y: number }, end: { x: number; y: number }) {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const distance = Math.hypot(dx, dy) || 1;
  const normalX = -dy / distance;
  const normalY = dx / distance;
  const bend = Math.min(56, Math.max(22, distance * 0.07));
  return { x: start.x + dx * 0.56 + normalX * bend, y: start.y + dy * 0.56 + normalY * bend };
}

function getBranchPath(start: { x: number; y: number }, end: { x: number; y: number }) {
  const joint = getBranchJoint(start, end);
  return `M ${start.x} ${start.y} L ${joint.x} ${joint.y} L ${end.x} ${end.y}`;
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

function MissionPanel({ anchor, technology, now, onClose }: { anchor: PanelAnchor; technology: LifeTechnology; now: number; onClose: () => void }) {
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
    <aside
      className="mission-panel life-tree-panel border border-border bg-card/95 p-4 backdrop-blur"
      data-category={technology.category}
      data-status={status}
      style={{ ["--panel-left" as string]: `${anchor.x}px`, ["--panel-top" as string]: `${anchor.y}px` }}
      onPointerDown={(event) => event.stopPropagation()}
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-black uppercase tracking-wide" style={{ color }}>{categoryLabels[technology.category]} / {getEraTitle(technology)}</p>
          <h2 className="mt-1 text-xl font-black text-foreground">{technology.title}</h2>
        </div>
        <div className="flex items-center gap-2">
          <div className="node-mini-emblem" style={{ color, borderColor: `${color}66`, ["--node-color" as string]: color }}>
            {status === "unlocked" ? <Icon size={21} /> : <span className="node-mini-pending" />}
          </div>
          <button type="button" className="tree-close-button" aria-label="Close mission panel" onClick={onClose}>
            <CloseIcon size={16} />
          </button>
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
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const [panelAnchor, setPanelAnchor] = useState<PanelAnchor>({ x: 16, y: 96 });
  const [returnView, setReturnView] = useState<ViewState | null>(null);
  const [now, setNow] = useState(() => Date.now());
  const [view, setView] = useState<ViewState>({ zoom: overviewZoom, pan: { x: 0, y: 0 } });
  const [dragStart, setDragStart] = useState<{ pointerId: number; x: number; y: number; panX: number; panY: number } | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const completedIds = useLifeStore((state) => state.completedTechnologyIds);
  const technologyRuntime = useLifeStore((state) => state.technologyRuntime);
  const selectedTechnology = useMemo(() => technologies.find((tech) => tech.id === selectedId) ?? null, [selectedId]);
  const rootTechnologies = useMemo(() => technologies.filter((tech) => tech.parents.length === 0), []);

  useEffect(() => {
    const interval = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(interval);
  }, []);

  function resetView() {
    setPanelOpen(false);
    setSelectedId(null);
    setReturnView(null);
    setView({ zoom: overviewZoom, pan: { x: 0, y: 0 } });
  }

  function focusTechnology(tech: LifeTechnology) {
    const rect = stageRef.current?.getBoundingClientRect();
    const stageWidth = rect?.width ?? 390;
    const stageHeight = rect?.height ?? 760;
    const node = getNodePoint(tech);
    const topSpace = 88;
    const bottomNavSpace = 92;
    const cardOffsetX = stageWidth >= 1024 ? -190 : 0;
    const cardOffsetY = stageWidth >= 1024 ? 0 : -110;
    const nextPan = {
      x: -(node.x - corePoint.x) * focusZoom + cardOffsetX,
      y: -(node.y - corePoint.y) * focusZoom + cardOffsetY
    };
    const screenX = stageWidth / 2 + nextPan.x + (node.x - corePoint.x) * focusZoom;
    const screenY = stageHeight / 2 + nextPan.y + (node.y - corePoint.y) * focusZoom;

    setSelectedId(tech.id);
    setPanelOpen(true);
    setView({ zoom: focusZoom, pan: nextPan });
    setPanelAnchor({
      x: clamp(screenX + 54, 16, Math.max(16, stageWidth - 392)),
      y: clamp(screenY - 190, topSpace, Math.max(topSpace, stageHeight - bottomNavSpace - 430))
    });
  }

  function handleNodeClick(tech: LifeTechnology) {
    if (!panelOpen) setReturnView(view);
    focusTechnology(tech);
  }

  function closePanel() {
    setPanelOpen(false);
    setSelectedId(null);
    if (returnView) setView(returnView);
    setReturnView(null);
  }

  function handleWheel(event: WheelEvent<HTMLDivElement>) {
    if (panelOpen) return;
    event.preventDefault();
    const rect = stageRef.current?.getBoundingClientRect();
    const stageWidth = rect?.width ?? 390;
    const stageHeight = rect?.height ?? 760;
    const delta = event.deltaY > 0 ? -0.08 : 0.08;
    const nextZoom = clamp(view.zoom + delta, minZoom, maxZoom);
    const zoomRatio = nextZoom / view.zoom;
    const pointerX = event.clientX - (rect?.left ?? 0) - stageWidth / 2;
    const pointerY = event.clientY - (rect?.top ?? 0) - stageHeight / 2;

    setView({
      zoom: nextZoom,
      pan: {
        x: pointerX - (pointerX - view.pan.x) * zoomRatio,
        y: pointerY - (pointerY - view.pan.y) * zoomRatio
      }
    });
  }

  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    if (event.button !== 0 || panelOpen) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    setDragStart({ pointerId: event.pointerId, x: event.clientX, y: event.clientY, panX: view.pan.x, panY: view.pan.y });
  }

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    if (!dragStart || dragStart.pointerId !== event.pointerId) return;
    setView((current) => ({ ...current, pan: { x: dragStart.panX + event.clientX - dragStart.x, y: dragStart.panY + event.clientY - dragStart.y } }));
  }

  function handlePointerUp(event: PointerEvent<HTMLDivElement>) {
    if (dragStart?.pointerId === event.pointerId) setDragStart(null);
  }

  return (
    <div className="life-tree-shell immersive-tree-shell">
      <div className="life-tree-toolbar epoch-toolbar">
        <div className="min-w-0">
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">Foundation Era</p>
          <p className="text-xs text-muted-foreground">Year 1 / 12 monthly epochs</p>
        </div>
        <div className="epoch-strip" aria-label="Era epochs">
          {epochs.map((epoch) => (
            <button key={epoch.id} type="button" disabled={!epoch.unlocked} className={cn("epoch-chip", epoch.unlocked ? "active" : "locked")}> 
              <span>{epoch.title}</span>
              <small>{epoch.duration}</small>
            </button>
          ))}
        </div>
        <button type="button" className="tree-tool-button shrink-0" aria-label="Center tree" onClick={resetView}><LocateFixed size={16} /></button>
      </div>

      <div
        ref={stageRef}
        className={cn("life-tree-stage", dragStart && "is-dragging", panelOpen && "is-focused")}
        onWheel={handleWheel}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <div className="life-tree-art-layer" aria-hidden="true">
          <div className="life-tree-art-image" />
          <div className="life-tree-art-atmosphere" />
        </div>

        <div className="life-tree-vignette" />
        <div className="life-tree-starfield" />
        <div className="life-tree-rune-grid" />

        <div
          className="life-tree-canvas"
          style={{ width: treeSize, height: treeSize, ["--tree-half" as string]: `-${treeSize / 2}px`, transform: `translate3d(${view.pan.x}px, ${view.pan.y}px, 0) scale(${view.zoom})` }}
        >
          {Object.entries(radialBranches).map(([id, branch]) => {
            const category = id as LifeCategory;
            const color = categoryColors[category];
            const angle = branch.angle * (Math.PI / 180);
            const x = corePoint.x + Math.cos(angle) * 250;
            const y = corePoint.y + Math.sin(angle) * 250;

            return (
              <div key={id} className="branch-label" title={branch.description} style={{ left: x, top: y, color, borderColor: `${color}30`, background: `${color}0f` }}>
                <strong>{branch.label}</strong>
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
                <stop offset="0%" stopColor="rgba(246, 196, 83, 0.34)" />
                <stop offset="45%" stopColor="rgba(76, 224, 210, 0.13)" />
                <stop offset="100%" stopColor="rgba(76, 224, 210, 0)" />
              </radialGradient>
            </defs>
            <circle cx={corePoint.x} cy={corePoint.y} r="560" fill="url(#coreAura)" />
            <circle cx={corePoint.x} cy={corePoint.y} r="360" fill="none" stroke="rgba(255,255,255,0.06)" strokeDasharray="3 18" />
            <circle cx={corePoint.x} cy={corePoint.y} r="760" fill="none" stroke="rgba(255,255,255,0.045)" strokeDasharray="2 22" />
            <circle cx={corePoint.x} cy={corePoint.y} r="1140" fill="none" stroke="rgba(255,255,255,0.035)" strokeDasharray="2 26" />
            <circle cx={corePoint.x} cy={corePoint.y} r="1500" fill="none" stroke="rgba(246,196,83,0.025)" strokeDasharray="1 30" />

            {rootTechnologies.map((tech) => {
              const runtime = technologyRuntime[tech.id];
              const status = getStatus(tech, completedIds, runtime?.status, runtime?.progress);
              const color = categoryColors[tech.category];
              const end = getNodePoint(tech);
              const joint = getBranchJoint(corePoint, end);

              return (
                <g key={`core-${tech.id}`}>
                  <path className="tree-connection-shadow" d={getBranchPath(corePoint, end)} fill="none" stroke="rgba(0,0,0,0.35)" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
                  <path
                    className={`tree-connection tree-connection-${status}`}
                    d={getBranchPath(corePoint, end)}
                    fill="none"
                    stroke={status === "locked" ? "rgba(148, 163, 184, 0.2)" : `${color}95`}
                    strokeWidth={status === "locked" ? 3 : 5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    filter={status !== "locked" ? "url(#connectionGlow)" : undefined}
                  />
                  <circle className={`tree-joint tree-joint-${status}`} cx={joint.x} cy={joint.y} r="5" fill={status === "locked" ? "rgba(148, 163, 184, 0.28)" : color} />
                </g>
              );
            })}

            {technologies.flatMap((tech) =>
              tech.parents.map((parentId) => {
                const parent = technologies.find((item) => item.id === parentId);
                if (!parent) return null;

                const runtime = technologyRuntime[tech.id];
                const status = getStatus(tech, completedIds, runtime?.status, runtime?.progress);
                const color = categoryColors[tech.category];
                const start = getNodePoint(parent);
                const end = getNodePoint(tech);
                const joint = getBranchJoint(start, end);

                return (
                  <g key={`${parentId}-${tech.id}`}>
                    <path className="tree-connection-shadow" d={getBranchPath(start, end)} fill="none" stroke="rgba(0,0,0,0.38)" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" />
                    <path
                      className={`tree-connection tree-connection-${status}`}
                      d={getBranchPath(start, end)}
                      fill="none"
                      stroke={status === "unlocked" ? color : status === "available" || status === "in_progress" ? `${color}AA` : "rgba(148, 163, 184, 0.18)"}
                      strokeWidth={status === "unlocked" ? 5 : status === "available" || status === "in_progress" ? 4 : 3}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      filter={status !== "locked" ? "url(#connectionGlow)" : undefined}
                    />
                    <circle className={`tree-joint tree-joint-${status}`} cx={joint.x} cy={joint.y} r="4" fill={status === "locked" ? "rgba(148, 163, 184, 0.22)" : color} />
                  </g>
                );
              })
            )}
          </svg>

          <button
            type="button"
            className="life-core-node"
            style={{ left: corePoint.x - 74, top: corePoint.y - 74 }}
            onPointerDown={(event) => event.stopPropagation()}
            onClick={resetView}
          >
            <span className="life-core-art" aria-hidden="true" />
            <Sparkles className="life-core-glyph" size={36} aria-hidden="true" />
            <span className="life-core-copy">
              <span className="text-[9px] font-black uppercase tracking-[0.24em] text-accent">Habidoo</span>
              <span className="text-sm font-black text-foreground">Life Core</span>
            </span>
          </button>

          {technologies.map((tech) => {
            const runtime = technologyRuntime[tech.id];
            const status = getStatus(tech, completedIds, runtime?.status, runtime?.progress);
            const color = categoryColors[tech.category];
            const Icon = categoryIcons[tech.category];
            const isSelected = selectedTechnology?.id === tech.id;
            const cooldownActive = runtime?.cooldownUntil ? runtime.cooldownUntil > now : false;
            const position = radialPositions[tech.id] ?? { x: tech.x, y: tech.y };

            return (
              <button
                key={tech.id}
                type="button"
                className={cn("tech-node-button radial-tech-node absolute flex w-32 flex-col items-center gap-2 text-center transition", status, isSelected && "selected")}
                data-category={tech.category}
                style={{ left: position.x, top: position.y, ["--node-color" as string]: color }}
                onPointerDown={(event) => event.stopPropagation()}
                onClick={() => handleNodeClick(tech)}
              >
                <span className="tech-orb tech-emblem grid place-items-center border bg-card/95 backdrop-blur">
                  <span className="tech-emblem-inner" />
                  {status === "locked" ? <Lock size={23} /> : status === "unlocked" ? <Icon size={27} /> : <span className="tech-pending-core" />}
                  {status === "unlocked" ? <span className="tech-completion-badge" aria-label="Completed" /> : null}
                  {runtime?.status === "active" ? <span className="absolute -right-1 -top-1 size-4 rounded-full bg-primary shadow-node" /> : null}
                  {cooldownActive ? <span className="absolute -bottom-1 -right-1 grid size-5 place-items-center rounded-full border border-border bg-background text-[9px]">cd</span> : null}
                </span>
                <span className="tech-node-label line-clamp-2 text-[12px] font-black leading-tight text-foreground">{tech.title}</span>
              </button>
            );
          })}
        </div>

        {panelOpen && selectedTechnology ? <MissionPanel anchor={panelAnchor} technology={selectedTechnology} now={now} onClose={closePanel} /> : null}
      </div>
    </div>
  );
}
