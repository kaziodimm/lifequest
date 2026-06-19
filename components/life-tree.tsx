"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { PointerEvent, WheelEvent } from "react";
import { Check, ChevronLeft, ChevronRight, Clock3, LocateFixed, Lock, Play, ShieldAlert, Sparkles, Timer, X as CloseIcon } from "lucide-react";
import { TechnologyGlyph } from "@/components/technology-glyph";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { lifeEras } from "@/lib/eras";
import { technologies, categoryColors, categoryLabels } from "@/lib/life-tree";
import { getTechnologyMission, getTechnologyTarget } from "@/lib/missions";
import { useLifeStore } from "@/lib/store";
import type { LifeCategory, LifeTechnology, TechStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

const treeSize = 4200;
const corePoint = { x: treeSize / 2, y: treeSize / 2 };
const nodeCenterOffsetX = 64;
const overviewZoom = 0.54;
const focusZoom = 1.06;
const minZoom = 0.34;
const maxZoom = 1.38;

type ViewState = { zoom: number; pan: { x: number; y: number } };
type PanelAnchor = { x: number; y: number };

const chapterNames = ["The Awakening", "Inner Order", "Momentum", "Stability", "Focus", "Expansion", "Control", "Confidence", "Systems", "Mastery Gate", "Ascension", "New Horizon"];

const epochs = chapterNames.map((title, index) => ({
  id: index + 1,
  title,
  duration: "1 month",
  unlocked: index === 0
}));

const radialBranches: Record<LifeCategory, { angle: number; label: string; description: string; labelSide: -1 | 1 }> = {
  health: { angle: -92, label: "Body & Energy", description: "Strength, sleep and recovery", labelSide: 1 },
  mind: { angle: -42, label: "Focus & Mind", description: "Clarity, learning and resilience", labelSide: -1 },
  business: { angle: 8, label: "Build & Create", description: "Turn ideas into useful systems", labelSide: 1 },
  career: { angle: 58, label: "Direction & Career", description: "Skills, contribution and growth", labelSide: -1 },
  finance: { angle: 118, label: "Money & Freedom", description: "Stability, choice and resources", labelSide: 1 },
  relationships: { angle: 178, label: "People & Connection", description: "Trust, community and support", labelSide: -1 },
  creativity: { angle: -152, label: "Creative Practice", description: "Expression, play and craft", labelSide: 1 }
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function getStatus(tech: LifeTechnology, completedIds: string[], runtimeStatus?: string, runtimeProgress = 0): TechStatus {
  if (completedIds.includes(tech.id)) return "unlocked";
  const completedParents = tech.parents.filter((parentId) => completedIds.includes(parentId)).length;
  if (completedParents < (tech.requiredParentCount ?? tech.parents.length)) return "locked";
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

type NodeRole = "key" | "major" | "minor";

function getNodeRole(tech: LifeTechnology, depth: number): NodeRole {
  if (tech.type === "challenge") return "key";
  if (tech.type === "milestone") return "major";
  const isRoot = tech.parents.length === 0;

  if (isRoot) return "key";
  return tech.unlocks.length === 0 || depth % 3 === 0 ? "major" : "minor";
}

function getNodeSize(role: NodeRole) {
  if (role === "key") return 98;
  if (role === "major") return 70;
  return 46;
}

function getTechnologyNodeSize(tech: LifeTechnology, role: NodeRole) {
  if (tech.type === "challenge") return 106;
  if (tech.type === "milestone") return 76;
  return getNodeSize(role);
}

function roundCoordinate(value: number) {
  return Math.round(value * 1000) / 1000;
}

function createRadialPositions() {
  const byId = new Map(technologies.map((tech) => [tech.id, tech]));
  const depthById = new Map<string, number>();
  const groups = new Map<string, LifeTechnology[]>();
  const visualParents: Record<string, string | null> = {};

  technologies.forEach((tech) => {
    const depth = getTechnologyDepth(tech, byId);
    depthById.set(tech.id, depth);
    if (tech.branch === "The Awakening") return;
    const key = `${tech.category}-${depth}`;
    groups.set(key, [...(groups.get(key) ?? []), tech]);
  });

  const positions: Record<string, { x: number; y: number; depth: number; role: NodeRole; size: number }> = {};

  (Object.keys(radialBranches) as LifeCategory[]).forEach((category) => {
    const depths = [...new Set(technologies.filter((tech) => tech.category === category && tech.branch !== "The Awakening").map((tech) => depthById.get(tech.id) ?? 0))].sort((a, b) => a - b);

    depths.forEach((depth, depthIndex) => {
      const group = groups.get(`${category}-${depth}`) ?? [];
      const previousGroup = depthIndex > 0 ? groups.get(`${category}-${depths[depthIndex - 1]}`) ?? [] : [];
      group.forEach((tech, index) => {
        visualParents[tech.id] = previousGroup.length ? previousGroup[Math.min(index, previousGroup.length - 1)].id : null;
      });
    });
  });

  technologies.forEach((tech) => {
    if (tech.branch === "The Awakening") {
      positions[tech.id] = { x: corePoint.x - 1120 - nodeCenterOffsetX, y: corePoint.y - 736 - 150, depth: 0, role: "key", size: 300 };
      visualParents[tech.id] = null;
      return;
    }
    const depth = depthById.get(tech.id) ?? 0;
    const group = groups.get(`${tech.category}-${depth}`) ?? [tech];
    const index = group.findIndex((item) => item.id === tech.id);
    const branch = radialBranches[tech.category];
    const role = getNodeRole(tech, depth);
    const size = getTechnologyNodeSize(tech, role);
    const siblingIndex = index - (group.length - 1) / 2;
    const fanAngle = clamp(siblingIndex * (8.25 + depth * 0.35), -14, 14);
    const branchCurve = depth * 0.9 * branch.labelSide;
    const angle = (branch.angle + fanAngle + branchCurve) * (Math.PI / 180);
    const radius = 340 + depth * 265 + Math.abs(siblingIndex) * 34;

    positions[tech.id] = {
      x: roundCoordinate(corePoint.x + Math.cos(angle) * radius - nodeCenterOffsetX),
      y: roundCoordinate(corePoint.y + Math.sin(angle) * radius - size / 2),
      depth,
      role,
      size
    };
  });

  return { positions, visualParents };
}

const radialLayout = createRadialPositions();
const radialPositions = radialLayout.positions;
const visualParents = radialLayout.visualParents;

function getNodePoint(tech: LifeTechnology) {
  const position = radialPositions[tech.id];
  if (!position) return { x: tech.x + nodeCenterOffsetX, y: tech.y + 46 };
  return { x: position.x + nodeCenterOffsetX, y: position.y + position.size / 2 };
}

function getBranchJoint(start: { x: number; y: number }, end: { x: number; y: number }) {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  return {
    x: roundCoordinate(start.x + dx * 0.56),
    y: roundCoordinate(start.y + dy * 0.56)
  };
}

function getBranchPath(start: { x: number; y: number }, end: { x: number; y: number }) {
  return `M ${roundCoordinate(start.x)} ${roundCoordinate(start.y)} L ${roundCoordinate(end.x)} ${roundCoordinate(end.y)}`;
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
  const technologyRuntime = useLifeStore((state) => state.technologyRuntime);
  const dailyMissions = useLifeStore((state) => state.dailyMissions);
  const globalMissionCooldownUntil = useLifeStore((state) => state.globalMissionCooldownUntil);
  const mission = getTechnologyMission(technology);
  const target = getTechnologyTarget(technology);
  const progress = runtime?.progress ?? technology.requirements[0]?.current ?? 0;
  const progressPercent = Math.min(100, (progress / target) * 100);
  const status = getStatus(technology, completedIds, runtime?.status, progress);
  const elapsedSeconds = runtime?.status === "active" && runtime.startedAt ? Math.max(0, Math.floor((now - runtime.startedAt) / 1000)) : 0;
  const remainingSeconds = Math.max(0, mission.minDurationSeconds - elapsedSeconds);
  const cooldownRemaining = runtime?.cooldownUntil ? Math.max(0, Math.floor((runtime.cooldownUntil - now) / 1000)) : 0;
  const globalCooldownRemaining = globalMissionCooldownUntil ? Math.max(0, Math.floor((globalMissionCooldownUntil - now) / 1000)) : 0;
  const anotherMissionActive = dailyMissions.some((item) => item.status === "active") || Object.entries(technologyRuntime).some(([id, item]) => id !== technology.id && item.status === "active");
  const canComplete = runtime?.status === "active" && remainingSeconds === 0;
  const nextUnlocks = technology.unlocks.map((id) => technologies.find((item) => item.id === id)?.title).filter(Boolean);
  const color = categoryColors[technology.category];

  return (
    <aside
      className="mission-panel life-tree-panel border border-border bg-card/95 p-4 backdrop-blur"
      data-category={technology.category}
      data-status={status}
      data-node-type={technology.type ?? "technology"}
      style={{ ["--panel-left" as string]: `${anchor.x}px`, ["--panel-top" as string]: `${anchor.y}px` }}
      onPointerDown={(event) => event.stopPropagation()}
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-black uppercase tracking-wide" style={{ color }}>{categoryLabels[technology.category]} / {technology.type ?? "technology"}</p>
          <h2 className="mt-1 text-xl font-black text-foreground">{technology.title}</h2>
        </div>
        <div className="flex items-center gap-2">
          <div className="node-mini-emblem" style={{ color, borderColor: `${color}66`, ["--node-color" as string]: color }}>
            {status === "locked" ? <Lock size={18} /> : <TechnologyGlyph icon={technology.icon} size={21} />}
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
          <p className="font-black text-foreground">{mission.actionTitle ?? mission.action}</p>
          {mission.actionDescription ? <p className="mt-1 text-xs leading-5 text-muted-foreground">{mission.actionDescription}</p> : null}
        </div>
        {mission.exactSteps?.length ? (
          <div className="rounded-md border border-border bg-muted/35 p-3">
            <p className="mb-2 text-xs font-black uppercase tracking-wide text-primary">Exact steps</p>
            <ol className="grid list-decimal gap-1.5 pl-5 text-xs leading-5 text-foreground">
              {mission.exactSteps.map((step) => <li key={step}>{step}</li>)}
            </ol>
          </div>
        ) : null}
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

      {mission.whatCounts || mission.whatDoesNotCount ? (
        <div className="mt-3 grid gap-2 text-xs sm:grid-cols-2">
          {mission.whatCounts ? <div className="rounded-md border border-border bg-muted/35 p-3"><strong className="text-foreground">What counts</strong><p className="mt-1 leading-5 text-muted-foreground">{mission.whatCounts}</p></div> : null}
          {mission.whatDoesNotCount ? <div className="rounded-md border border-border bg-muted/35 p-3"><strong className="text-foreground">Does not count</strong><p className="mt-1 leading-5 text-muted-foreground">{mission.whatDoesNotCount}</p></div> : null}
        </div>
      ) : null}

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
      ) : anotherMissionActive ? (
        <Button className="mt-4 w-full" disabled variant="outline">
          <ShieldAlert size={16} /> Another mission is already active.
        </Button>
      ) : globalCooldownRemaining > 0 ? (
        <Button className="mt-4 w-full" disabled variant="outline">
          <Clock3 size={16} /> Global cooldown {formatDuration(globalCooldownRemaining)}
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
  const canvasRef = useRef<HTMLDivElement | null>(null);
  const artLayerRef = useRef<HTMLDivElement | null>(null);
  const epochStripRef = useRef<HTMLDivElement | null>(null);
  const viewRef = useRef(view);
  const pendingDragPanRef = useRef<ViewState["pan"] | null>(null);
  const dragFrameRef = useRef<number | null>(null);
  const completedIds = useLifeStore((state) => state.completedTechnologyIds);
  const technologyRuntime = useLifeStore((state) => state.technologyRuntime);
  const selectedTechnology = useMemo(() => technologies.find((tech) => tech.id === selectedId) ?? null, [selectedId]);
  const rootTechnologies = useMemo(() => technologies.filter((tech) => tech.parents.length === 0), []);

  useEffect(() => {
    const interval = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    viewRef.current = view;
    const artLayer = artLayerRef.current;
    if (artLayer) {
      const parallaxX = clamp(view.pan.x * 0.055, -72, 72);
      const parallaxY = clamp(view.pan.y * 0.055, -72, 72);
      const depthScale = 1.018 + Math.max(0, view.zoom - overviewZoom) * 0.035;
      artLayer.style.transform = `translate3d(${parallaxX}px, ${parallaxY}px, 0) scale(${depthScale})`;
    }
  }, [view]);

  useEffect(() => () => {
    if (dragFrameRef.current !== null) window.cancelAnimationFrame(dragFrameRef.current);
  }, []);

  function resetView() {
    setPanelOpen(false);
    setSelectedId(null);
    setReturnView(null);
    setView({ zoom: overviewZoom, pan: { x: 0, y: 0 } });
  }

  function scrollEpochs(direction: -1 | 1) {
    epochStripRef.current?.scrollBy({ left: direction * 360, behavior: "smooth" });
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
    const nextPan = { x: dragStart.panX + event.clientX - dragStart.x, y: dragStart.panY + event.clientY - dragStart.y };
    pendingDragPanRef.current = nextPan;
    if (dragFrameRef.current !== null) return;

    dragFrameRef.current = window.requestAnimationFrame(() => {
      dragFrameRef.current = null;
      const pan = pendingDragPanRef.current;
      const canvas = canvasRef.current;
      if (!pan || !canvas) return;
      canvas.style.transform = `translate3d(${pan.x}px, ${pan.y}px, 0) scale(${viewRef.current.zoom})`;
      const artLayer = artLayerRef.current;
      if (artLayer) {
        const parallaxX = clamp(pan.x * 0.055, -72, 72);
        const parallaxY = clamp(pan.y * 0.055, -72, 72);
        const depthScale = 1.018 + Math.max(0, viewRef.current.zoom - overviewZoom) * 0.035;
        artLayer.style.transform = `translate3d(${parallaxX}px, ${parallaxY}px, 0) scale(${depthScale})`;
      }
    });
  }

  function handlePointerUp(event: PointerEvent<HTMLDivElement>) {
    if (dragStart?.pointerId !== event.pointerId) return;
    if (dragFrameRef.current !== null) {
      window.cancelAnimationFrame(dragFrameRef.current);
      dragFrameRef.current = null;
    }
    const finalPan = pendingDragPanRef.current;
    pendingDragPanRef.current = null;
    if (finalPan) setView((current) => ({ ...current, pan: finalPan }));
    setDragStart(null);
  }

  return (
    <div className="life-tree-shell immersive-tree-shell">
      <div className="life-tree-toolbar epoch-toolbar">
        <div className="min-w-0">
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">The Awakening</p>
          <p className="text-xs text-muted-foreground">Chapter 1 / 12 · about 30 days</p>
        </div>
        <div className="epoch-navigation">
          <button type="button" className="epoch-scroll-button" aria-label="Previous epochs" onClick={() => scrollEpochs(-1)}><ChevronLeft size={16} /></button>
          <div ref={epochStripRef} className="epoch-strip" aria-label="Era epochs">
            {epochs.map((epoch) => (
              <button key={epoch.id} type="button" disabled={!epoch.unlocked} className={cn("epoch-chip", epoch.unlocked ? "active" : "locked")}> 
                <span>{epoch.title}</span>
                <small>{epoch.duration}</small>
              </button>
            ))}
          </div>
          <button type="button" className="epoch-scroll-button" aria-label="Next epochs" onClick={() => scrollEpochs(1)}><ChevronRight size={16} /></button>
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
        <div ref={artLayerRef} className="life-tree-art-layer" aria-hidden="true">
          <div className="life-tree-art-image" />
          <div className="life-tree-art-atmosphere" />
        </div>

        <div className="life-tree-vignette" />
        <div className="life-tree-starfield" />
        <div className="life-tree-rune-grid" />

        <div
          ref={canvasRef}
          className="life-tree-canvas"
          style={{ width: treeSize, height: treeSize, ["--tree-half" as string]: `-${treeSize / 2}px`, transform: `translate3d(${view.pan.x}px, ${view.pan.y}px, 0) scale(${view.zoom})` }}
        >
          <svg className="pointer-events-none absolute inset-0 size-full" viewBox={`0 0 ${treeSize} ${treeSize}`} aria-hidden="true">
            <defs>
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
                  <path className="tree-connection-shadow" d={getBranchPath(corePoint, end)} fill="none" stroke="rgba(0,0,0,0.3)" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
                  {status === "unlocked" ? <path className="tree-connection-glow" d={getBranchPath(corePoint, end)} fill="none" stroke={color} strokeWidth="13" strokeLinecap="round" strokeLinejoin="round" /> : null}
                  <path
                    className={`tree-connection tree-connection-${status}`}
                    d={getBranchPath(corePoint, end)}
                    fill="none"
                    stroke={status === "locked" ? "rgba(148, 163, 184, 0.2)" : `${color}95`}
                    strokeWidth={status === "locked" ? 3 : 5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle className={`tree-joint tree-joint-${status}`} cx={joint.x} cy={joint.y} r="5" fill={status === "locked" ? "rgba(148, 163, 184, 0.28)" : color} />
                </g>
              );
            })}

            {technologies.map((tech) => {
                const parentId = visualParents[tech.id];
                if (!parentId) return null;
                const parent = technologies.find((item) => item.id === parentId);
                if (!parent) return null;

                const runtime = technologyRuntime[tech.id];
                const status = getStatus(tech, completedIds, runtime?.status, runtime?.progress);
                const color = categoryColors[tech.category];
                const start = getNodePoint(parent);
                const end = getNodePoint(tech);
                const joint = getBranchJoint(start, end);

                return (
                  <g key={`visual-${parentId}-${tech.id}`}>
                    <path className="tree-connection-shadow" d={getBranchPath(start, end)} fill="none" stroke="rgba(0,0,0,0.3)" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
                    {status === "unlocked" ? <path className="tree-connection-glow" d={getBranchPath(start, end)} fill="none" stroke={color} strokeWidth="13" strokeLinecap="round" strokeLinejoin="round" /> : null}
                    <path
                      className={`tree-connection tree-connection-${status}`}
                      d={getBranchPath(start, end)}
                      fill="none"
                      stroke={status === "unlocked" ? color : status === "available" || status === "in_progress" ? `${color}AA` : "rgba(148, 163, 184, 0.18)"}
                      strokeWidth={status === "unlocked" ? 5 : status === "available" || status === "in_progress" ? 4 : 3}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <circle className={`tree-joint tree-joint-${status}`} cx={joint.x} cy={joint.y} r="4" fill={status === "locked" ? "rgba(148, 163, 184, 0.22)" : color} />
                  </g>
                );
              })}
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
            const isSelected = selectedTechnology?.id === tech.id;
            const cooldownActive = runtime?.cooldownUntil ? runtime.cooldownUntil > now : false;
            const position = radialPositions[tech.id] ?? { x: tech.x, y: tech.y };
            const isPolarStar = tech.id === "awakening-trial";

            return (
              <button
                key={tech.id}
                type="button"
                className={cn("tech-node-button radial-tech-node absolute flex w-32 flex-col items-center gap-2 text-center transition", status, isSelected && "selected", isPolarStar && "polar-star-node")}
                data-category={tech.category}
                data-tech-id={tech.id}
                data-node-role={position.role}
                data-node-type={tech.type ?? "technology"}
                style={{ left: position.x, top: position.y, ["--node-color" as string]: color, ["--node-size" as string]: `${position.size}px` }}
                onPointerDown={(event) => event.stopPropagation()}
                onClick={() => handleNodeClick(tech)}
              >
                {isPolarStar ? (
                  <span className="polar-star-art">
                    <span className="polar-star-face" aria-hidden="true" />
                    {status === "unlocked" ? <span className="tech-completion-badge" role="img" aria-label="Mission completed" title="Mission completed"><Check /></span> : null}
                  </span>
                ) : (
                  <span className="tech-orb tech-emblem grid place-items-center border bg-card/95 backdrop-blur">
                    <span className="tech-emblem-inner" />
                    {status === "locked" ? <Lock size={23} /> : <TechnologyGlyph icon={tech.icon} size={27} />}
                    {status === "unlocked" ? <span className="tech-completion-badge" role="img" aria-label="Mission completed" title="Mission completed"><Check /></span> : null}
                    {runtime?.status === "active" ? <span className="absolute -right-1 -top-1 size-4 rounded-full bg-primary shadow-node" /> : null}
                    {cooldownActive ? <span className="absolute -bottom-1 -right-1 grid size-5 place-items-center rounded-full border border-border bg-background text-[9px]">cd</span> : null}
                  </span>
                )}
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
