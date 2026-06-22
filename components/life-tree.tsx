"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { PointerEvent, WheelEvent } from "react";
import { Check, ChevronLeft, ChevronRight, Clock3, LocateFixed, Lock, Play, ShieldAlert, Sparkles, Timer, X as CloseIcon } from "lucide-react";
import { TechnologyGlyph } from "@/components/technology-glyph";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { lifeEras } from "@/lib/eras";
import { technologies, categoryColors, categoryLabels } from "@/lib/life-tree";
import { getMissionDefinition, getTechnologyMission, getTechnologyTarget, hasRequiredMissionAnswers } from "@/lib/missions";
import { getTechnologyLockReasons } from "@/lib/progression";
import { useLifeStore } from "@/lib/store";
import type { LifeCategory, LifeTechnology, MissionAnswer, MissionInput, TechStatus } from "@/lib/types";
import { cn } from "@/lib/utils";
import { translate, translateDynamic } from "@/lib/i18n";
import { localizeTechnology } from "@/lib/technology-i18n";
import { applyFocusObject, localizeMissionDefinition } from "@/lib/mission-i18n";

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
  duration: index === 0 ? "about 30 days" : "Soon",
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

function getStatus(tech: LifeTechnology, completedIds: string[], runtimeStatus?: string, runtimeProgress = 0, progressionLocked = false): TechStatus {
  if (completedIds.includes(tech.id)) return "unlocked";
  if (progressionLocked) return "locked";
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
      positions[tech.id] = { x: corePoint.x - 880 - nodeCenterOffsetX, y: corePoint.y - 1056 - 150, depth: 0, role: "key", size: 300 };
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

function MissionInputControl({ input, value, onChange, otherLabel }: { input: MissionInput; value?: MissionAnswer; onChange: (value: MissionAnswer) => void; otherLabel: string }) {
  const choices = input.choices ?? [];
  if (input.type === "singleChoice") return (
    <div className="grid gap-2">
      {choices.map((choice) => <button key={choice.id} type="button" className={cn("rounded-md border p-2.5 text-left text-xs transition", value === choice.id ? "border-primary bg-primary/10 text-foreground" : "border-border bg-background/45 text-muted-foreground")} onClick={() => onChange(choice.id)}><span className="font-bold">{choice.label}</span>{choice.description ? <span className="mt-1 block">{choice.description}</span> : null}</button>)}
      {input.allowCustomChoice ? <input className="h-10 rounded-md border border-border bg-background/60 px-3 text-xs outline-none focus:border-primary" placeholder={otherLabel} value={typeof value === "string" && !choices.some((choice) => choice.id === value) ? value : ""} onChange={(event) => onChange(event.target.value)} /> : null}
    </div>
  );
  if (input.type === "rating") return <div className="grid grid-cols-5 gap-2">{Array.from({ length: (input.max ?? 5) - (input.min ?? 1) + 1 }, (_, index) => index + (input.min ?? 1)).map((rating) => <button key={rating} type="button" className={cn("min-h-10 rounded-md border text-sm font-black", value === rating ? "border-primary bg-primary/15 text-primary" : "border-border bg-background/45 text-muted-foreground")} onClick={() => onChange(rating)}>{rating}</button>)}</div>;
  if (input.type === "confirmation") return <button type="button" className={cn("flex min-h-11 w-full items-center gap-3 rounded-md border p-3 text-left text-xs", value === true ? "border-primary bg-primary/10 text-foreground" : "border-border bg-background/45 text-muted-foreground")} onClick={() => onChange(value !== true)}><span className={cn("grid size-5 shrink-0 place-items-center rounded border", value === true ? "border-primary bg-primary text-primary-foreground" : "border-border")}>{value === true ? <Check size={13} /> : null}</span>{input.label}</button>;
  return <input type={input.type === "number" ? "number" : input.type === "dateOrTime" ? "datetime-local" : input.type === "link" ? "url" : "text"} className="h-10 w-full rounded-md border border-border bg-background/60 px-3 text-xs outline-none focus:border-primary" placeholder={input.placeholder ?? input.example} value={typeof value === "string" || typeof value === "number" ? value : ""} onChange={(event) => onChange(input.type === "number" ? Number(event.target.value) : event.target.value)} />;
}

function MissionPanel({ anchor, technology, now, onClose }: { anchor: PanelAnchor; technology: LifeTechnology; now: number; onClose: () => void }) {
  const runtime = useLifeStore((state) => state.technologyRuntime[technology.id]);
  const completedIds = useLifeStore((state) => state.completedTechnologyIds);
  const startTechnologyMission = useLifeStore((state) => state.startTechnologyMission);
  const completeTechnologyMission = useLifeStore((state) => state.completeTechnologyMission);
  const technologyRuntime = useLifeStore((state) => state.technologyRuntime);
  const globalMissionCooldownUntil = useLifeStore((state) => state.globalMissionCooldownUntil);
  const totalXp = useLifeStore((state) => state.totalXp);
  const insightPoints = useLifeStore((state) => state.insightPoints);
  const locale = useLifeStore((state) => state.locale);
  const activeAttemptId = useLifeStore((state) => state.activeMissionAttemptId);
  const activeAttempt = useLifeStore((state) => state.missionAttempts.find((attempt) => attempt.id === state.activeMissionAttemptId && attempt.technologyId === technology.id));
  const focusObject = useLifeStore((state) => state.focusObjects.find((item) => item.category === technology.category));
  const setMissionAnswer = useLifeStore((state) => state.setMissionAnswer);
  const localizedTechnology = localizeTechnology(technology, locale);
  const mission = getTechnologyMission(localizedTechnology);
  const definition = applyFocusObject(localizeMissionDefinition(getMissionDefinition(localizedTechnology), locale), focusObject, locale);
  const target = getTechnologyTarget(technology);
  const progress = runtime?.progress ?? technology.requirements[0]?.current ?? 0;
  const progressPercent = Math.min(100, (progress / target) * 100);
  const lockReasons = getTechnologyLockReasons(technology, { completedTechnologyIds: completedIds, totalXp, insightPoints });
  const status = getStatus(technology, completedIds, runtime?.status, progress, lockReasons.length > 0);
  const elapsedSeconds = runtime?.status === "active" && runtime.startedAt ? Math.max(0, Math.floor((now - runtime.startedAt) / 1000)) : 0;
  const remainingSeconds = Math.max(0, mission.minDurationSeconds - elapsedSeconds);
  const cooldownRemaining = runtime?.cooldownUntil ? Math.max(0, Math.floor((runtime.cooldownUntil - now) / 1000)) : 0;
  const globalCooldownRemaining = globalMissionCooldownUntil ? Math.max(0, Math.floor((globalMissionCooldownUntil - now) / 1000)) : 0;
  const anotherMissionActive = Object.entries(technologyRuntime).some(([id, item]) => id !== technology.id && item.status === "active");
  const answersReady = activeAttempt ? hasRequiredMissionAnswers(definition, activeAttempt.answers) : false;
  const canComplete = runtime?.status === "active" && remainingSeconds === 0 && answersReady;
  const nextUnlocks = technology.unlocks.map((id) => {
    const item = technologies.find((candidate) => candidate.id === id);
    return item ? localizeTechnology(item, locale).title : undefined;
  }).filter(Boolean);
  const color = categoryColors[technology.category];
  const researchReward = technology.rewards.researchPoints?.[technology.category] ?? 0;
  const futureRewards = [technology.rewards.badge && `${translate(locale, "Badge")}: ${technology.rewards.badge}`, technology.rewards.title && `${translate(locale, "Title")}: ${technology.rewards.title}`, technology.rewards.themeUnlock && `${translate(locale, "Theme")}: ${technology.rewards.themeUnlock}`].filter(Boolean);

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
          <p className="text-[11px] font-black uppercase tracking-wide" style={{ color }}>{translate(locale, categoryLabels[technology.category])} / {translate(locale, technology.type ?? "technology")}</p>
          <h2 className="mt-1 text-xl font-black text-foreground">{localizedTechnology.title}</h2>
        </div>
        <div className="flex items-center gap-2">
          <div className="node-mini-emblem" style={{ color, borderColor: `${color}66`, ["--node-color" as string]: color }}>
            {status === "locked" ? <Lock size={18} /> : <TechnologyGlyph icon={technology.icon} size={21} />}
          </div>
          <button type="button" className="tree-close-button" aria-label={translate(locale, "Close mission panel")} onClick={onClose}>
            <CloseIcon size={16} />
          </button>
        </div>
      </div>

      <p className="text-sm leading-6 text-muted-foreground">{localizedTechnology.description}</p>

      <div className="mt-3 rounded-md border border-border bg-muted/35 p-3">
        <p className="mb-1 flex items-center gap-2 text-xs font-black uppercase tracking-wide text-primary"><Sparkles size={14} /> {translate(locale, "What do I do now?")}</p>
        <p className="font-black text-foreground">{definition.actionTitle}</p>
      </div>

      <div className="mt-3 rounded-md border border-primary/25 bg-primary/5 p-3">
        <p className="text-[10px] font-black uppercase tracking-wide text-primary">{translate(locale, "Concrete result")}</p>
        <p className="mt-1 text-sm font-bold text-foreground">{definition.concreteOutcome}</p>
        {definition.recommendedChoice ? <p className="mt-2 text-xs leading-5 text-muted-foreground"><strong className="text-foreground">{translate(locale, "Recommended")}:</strong> {definition.recommendedChoice}</p> : null}
        {definition.exampleResult ? <p className="mt-1 text-xs leading-5 text-muted-foreground"><strong className="text-foreground">{translate(locale, "Example")}:</strong> {definition.exampleResult}</p> : null}
      </div>

      {status === "available" && !anotherMissionActive && globalCooldownRemaining <= 0 && cooldownRemaining <= 0 ? <Button className="mt-3 w-full" onClick={() => startTechnologyMission(technology.id)}><Play size={16} />{translate(locale, "Start Mission")}</Button> : null}

      {runtime?.status === "active" ? <div className="mt-3 rounded-md border border-primary/35 bg-primary/10 p-3"><p className="text-xs font-bold text-muted-foreground">{translate(locale, "Research timer:")}</p><p className="mt-1 text-xl font-black text-primary">{formatDuration(elapsedSeconds)} / {formatDuration(mission.minDurationSeconds)}</p></div> : null}

      {runtime?.status === "active" && definition.inputSchema.length ? (
        <div className="mt-3 grid gap-3 rounded-md border border-border bg-background/55 p-3">
          <div><p className="text-xs font-black uppercase tracking-wide text-primary">{translate(locale, "Save the result")}</p><p className="mt-1 text-xs text-muted-foreground">{translate(locale, "Required answers stay in Habidoo and become part of this mission attempt.")}</p></div>
          {definition.inputSchema.map((input) => (
            <label key={input.id} className="grid gap-2 text-xs font-bold text-foreground">
              {input.type === "confirmation" ? null : <span>{input.label}{input.required ? " *" : ""}</span>}
              <MissionInputControl input={input} value={activeAttempt?.answers[input.id]} otherLabel={translate(locale, "Other option")} onChange={(value) => activeAttemptId && setMissionAnswer(activeAttemptId, input.id, value)} />
              {input.helpText ? <span className="font-normal text-muted-foreground">{input.helpText}</span> : null}
            </label>
          ))}
        </div>
      ) : null}

      {runtime?.status === "active" ? <Button className="mt-3 w-full" disabled={!canComplete} onClick={() => completeTechnologyMission(technology.id)}><Check size={16} />{canComplete ? translate(locale, "Complete Mission") : remainingSeconds > 0 ? `${translate(locale, "Keep going")} ${formatDuration(remainingSeconds)}` : translate(locale, "Complete required answers")}</Button> : null}

      <details className="mt-4 rounded-md border border-border bg-background/35 p-3">
        <summary className="cursor-pointer text-xs font-black uppercase tracking-wide text-muted-foreground">{translate(locale, "Details")}</summary>

      <div className="mt-4 rounded-md border border-border bg-background/45 p-3">
        <div className="mb-2 flex items-center justify-between text-xs font-bold">
          <span>{translate(locale, "Research progress")}</span>
          <span style={{ color }}>{progress}/{target}</span>
        </div>
        <Progress value={progressPercent} />
        <p className="mt-2 text-xs text-muted-foreground">{localizedTechnology.requirements[0]?.label ?? translate(locale, "Complete real-world mission")}</p>
      </div>

      <div className="mt-4 grid gap-2 text-sm">
        {mission.exactSteps?.length ? (
          <div className="rounded-md border border-border bg-muted/35 p-3">
            <p className="mb-2 text-xs font-black uppercase tracking-wide text-primary">{translate(locale, "Exact steps")}</p>
            <ol className="grid list-decimal gap-1.5 pl-5 text-xs leading-5 text-foreground">
              {mission.exactSteps.map((step) => <li key={step}>{step}</li>)}
            </ol>
          </div>
        ) : null}
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-md border border-border bg-muted/35 p-3">
            <p className="mb-1 flex items-center gap-2 text-xs font-black uppercase tracking-wide text-muted-foreground"><Timer size={14} /> {translate(locale, "Duration")}</p>
            <p className="font-bold text-foreground">{mission.durationLabel}</p>
          </div>
          <div className="rounded-md border border-border bg-muted/35 p-3">
            <p className="mb-1 flex items-center gap-2 text-xs font-black uppercase tracking-wide text-muted-foreground"><Clock3 size={14} /> {translate(locale, "Cooldown")}</p>
            <p className="font-bold text-foreground">{translate(locale, "Personal")} {formatDuration(mission.personalCooldownSeconds ?? mission.cooldownSeconds)}</p>
            <p className="mt-1 text-[10px] text-muted-foreground">{translate(locale, "Global")} {translate(locale, mission.globalCooldownType ?? "standard")}</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <div className="rounded-md border border-border bg-muted/35 p-3"><p className="text-[10px] font-black uppercase text-muted-foreground">XP</p><p className="mt-1 font-black text-foreground">+{technology.rewards.xp}</p></div>
          <div className="rounded-md border border-border bg-muted/35 p-3"><p className="text-[10px] font-black uppercase text-muted-foreground">{translate(locale, "Research")}</p><p className="mt-1 font-black text-foreground">+{researchReward}</p></div>
          <div className="rounded-md border border-border bg-muted/35 p-3"><p className="text-[10px] font-black uppercase text-muted-foreground">{translate(locale, "Insight")}</p><p className="mt-1 font-black text-foreground">+{technology.rewards.insightPoints ?? 0}</p></div>
        </div>
        <div className="rounded-md border border-border bg-muted/35 p-3 text-xs">
          <p className="font-black uppercase tracking-wide text-muted-foreground">{translate(locale, "Future reward")}</p>
          <p className="mt-1 leading-5 text-foreground">{futureRewards.length ? futureRewards.join(" · ") : translate(locale, "Cosmetic reward slot prepared")}</p>
        </div>
      </div>
      </details>

      {mission.whatCounts || mission.whatDoesNotCount ? (
        <div className="mt-3 grid gap-2 text-xs sm:grid-cols-2">
          {mission.whatCounts ? <div className="rounded-md border border-border bg-muted/35 p-3"><strong className="text-foreground">{translate(locale, "What counts")}</strong><p className="mt-1 leading-5 text-muted-foreground">{mission.whatCounts}</p></div> : null}
          {mission.whatDoesNotCount ? <div className="rounded-md border border-border bg-muted/35 p-3"><strong className="text-foreground">{translate(locale, "Does not count")}</strong><p className="mt-1 leading-5 text-muted-foreground">{mission.whatDoesNotCount}</p></div> : null}
        </div>
      ) : null}

      <div className="mt-4 rounded-md border border-border bg-background/45 p-3">
        <p className="mb-2 text-xs font-black uppercase tracking-wide text-muted-foreground">{translate(locale, "Next unlock")}</p>
        <p className="text-sm font-bold text-foreground">{nextUnlocks.length ? nextUnlocks.join(", ") : translate(locale, "Branch mastery")}</p>
      </div>

      {technology.type === "challenge" ? (
        <div className="mt-3 rounded-md border border-border bg-muted/35 p-3 text-xs">
          <p className="font-black uppercase tracking-wide text-primary">{translate(locale, "Trial readiness")}</p>
          <p className="mt-2 text-muted-foreground">{translate(locale, "Level")} {technology.requiredLevel ?? translate(locale, "future")} · {translate(locale, "Insight")} {technology.requiredInsightPoints ?? translate(locale, "future")} · {translate(locale, "Branch milestones")} {technology.requiredCompletedBranches ?? 1}</p>
          {lockReasons.length ? <ul className="mt-2 grid list-disc gap-1 pl-4 text-foreground">{lockReasons.map((reason) => <li key={reason}>{translateDynamic(locale, reason)}</li>)}</ul> : <p className="mt-2 font-bold text-foreground">{translate(locale, "Current readiness requirements met.")}</p>}
        </div>
      ) : null}

      {status === "locked" ? (
        <div className="mt-4 flex items-start gap-2 rounded-md border border-border bg-muted/35 p-3 text-xs text-muted-foreground">
          <ShieldAlert size={16} className="mt-0.5 shrink-0" /> {translateDynamic(locale, lockReasons[0] ?? "Unlock parent technologies first.")}
        </div>
      ) : runtime?.status === "active" ? null : cooldownRemaining > 0 ? (
        <Button className="mt-4 w-full" disabled variant="outline">
          <Clock3 size={16} /> {translate(locale, "Cooldown")} {formatDuration(cooldownRemaining)}
        </Button>
      ) : status === "unlocked" ? (
        <Button className="mt-4 w-full" disabled variant="secondary">
          <Check size={16} /> {translate(locale, "Technology completed")}
        </Button>
      ) : anotherMissionActive ? (
        <Button className="mt-4 w-full" disabled variant="outline">
          <ShieldAlert size={16} /> {translate(locale, "Another mission is already active.")}
        </Button>
      ) : globalCooldownRemaining > 0 ? (
        <Button className="mt-4 w-full" disabled variant="outline">
          <Clock3 size={16} /> {translate(locale, "Global cooldown")} {formatDuration(globalCooldownRemaining)}
        </Button>
      ) : null}
    </aside>
  );
}

export function LifeTree({ initialTechnologyId }: { initialTechnologyId?: string | null }) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const [panelAnchor, setPanelAnchor] = useState<PanelAnchor>({ x: 16, y: 96 });
  const [returnView, setReturnView] = useState<ViewState | null>(null);
  const [now, setNow] = useState(() => Date.now());
  const [view, setView] = useState<ViewState>({ zoom: overviewZoom, pan: { x: 0, y: 0 } });
  const [dragStart, setDragStart] = useState<{ pointerId: number; x: number; y: number; panX: number; panY: number } | null>(null);
  const [stableMobileRendering, setStableMobileRendering] = useState(false);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLDivElement | null>(null);
  const artLayerRef = useRef<HTMLDivElement | null>(null);
  const epochStripRef = useRef<HTMLDivElement | null>(null);
  const viewRef = useRef(view);
  const pendingDragPanRef = useRef<ViewState["pan"] | null>(null);
  const dragFrameRef = useRef<number | null>(null);
  const initialFocusDoneRef = useRef(false);
  const completedIds = useLifeStore((state) => state.completedTechnologyIds);
  const technologyRuntime = useLifeStore((state) => state.technologyRuntime);
  const totalXp = useLifeStore((state) => state.totalXp);
  const insightPoints = useLifeStore((state) => state.insightPoints);
  const locale = useLifeStore((state) => state.locale);
  const activeTechnology = technologies.find((technology) => technologyRuntime[technology.id]?.status === "active");
  const selectedTechnology = useMemo(() => technologies.find((tech) => tech.id === selectedId) ?? null, [selectedId]);
  const rootTechnologies = useMemo(() => technologies.filter((tech) => tech.parents.length === 0), []);
  const progressionLockedIds = useMemo(() => new Set(technologies.filter((technology) => getTechnologyLockReasons(technology, { completedTechnologyIds: completedIds, totalXp, insightPoints }).length > 0).map((technology) => technology.id)), [completedIds, insightPoints, totalXp]);

  useEffect(() => {
    const interval = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!initialTechnologyId || initialFocusDoneRef.current) return;
    const technology = technologies.find((item) => item.id === initialTechnologyId);
    if (!technology) return;
    initialFocusDoneRef.current = true;
    const frame = window.requestAnimationFrame(() => {
      setReturnView({ zoom: overviewZoom, pan: { x: 0, y: 0 } });
      focusTechnology(technology);
    });
    return () => window.cancelAnimationFrame(frame);
  }, [initialTechnologyId]);

  useEffect(() => {
    setStableMobileRendering(window.matchMedia("(pointer: coarse)").matches);
  }, []);

  useEffect(() => {
    viewRef.current = view;
    const artLayer = artLayerRef.current;
    if (artLayer) {
      if (stableMobileRendering) {
        artLayer.style.transform = "translate(0, 0) scale(1.08)";
      } else {
        const parallaxX = clamp(view.pan.x * 0.055, -72, 72);
        const parallaxY = clamp(view.pan.y * 0.055, -72, 72);
        const depthScale = 1.018 + Math.max(0, view.zoom - overviewZoom) * 0.035;
        artLayer.style.transform = `translate3d(${parallaxX}px, ${parallaxY}px, 0) scale(${depthScale})`;
      }
    }
  }, [stableMobileRendering, view]);

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
    const strip = epochStripRef.current;
    if (!strip) return;
    const isCompact = strip.clientWidth < 520;
    const step = isCompact ? 112 : Math.min(360, strip.clientWidth * .72);
    strip.scrollBy({ left: direction * step, behavior: isCompact ? "auto" : "smooth" });
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
      canvas.style.transform = stableMobileRendering
        ? `translate(${pan.x}px, ${pan.y}px) scale(${viewRef.current.zoom})`
        : `translate3d(${pan.x}px, ${pan.y}px, 0) scale(${viewRef.current.zoom})`;
      const artLayer = artLayerRef.current;
      if (artLayer && !stableMobileRendering) {
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
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">{translate(locale, "The Awakening")}</p>
          <p className="text-xs text-muted-foreground">{translate(locale, "Chapter 1 / 12")} · {translate(locale, "about 30 days")}</p>
          {activeTechnology ? <button type="button" className="mt-1 text-[10px] font-black text-primary underline-offset-2 hover:underline" onClick={() => handleNodeClick(activeTechnology)}>{translate(locale, "Return to active mission")}</button> : null}
        </div>
        <div className="epoch-navigation">
          <button type="button" className="epoch-scroll-button" aria-label={translate(locale, "Previous epochs")} onClick={() => scrollEpochs(-1)}><ChevronLeft size={16} /></button>
          <div ref={epochStripRef} className="epoch-strip" aria-label={translate(locale, "Era epochs")}>
            {epochs.map((epoch) => (
              <button key={epoch.id} type="button" disabled={!epoch.unlocked} className={cn("epoch-chip", epoch.unlocked ? "active" : "locked")}>
                <span>{translate(locale, epoch.title)}</span>
                <small>{translate(locale, epoch.duration)}</small>
              </button>
            ))}
          </div>
          <button type="button" className="epoch-scroll-button" aria-label={translate(locale, "Next epochs")} onClick={() => scrollEpochs(1)}><ChevronRight size={16} /></button>
        </div>
        <button type="button" className="tree-tool-button shrink-0" aria-label={translate(locale, "Center tree")} onClick={resetView}><LocateFixed size={16} /></button>
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
          style={{ width: treeSize, height: treeSize, ["--tree-half" as string]: `-${treeSize / 2}px`, transform: stableMobileRendering ? `translate(${view.pan.x}px, ${view.pan.y}px) scale(${view.zoom})` : `translate3d(${view.pan.x}px, ${view.pan.y}px, 0) scale(${view.zoom})` }}
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
              const status = getStatus(tech, completedIds, runtime?.status, runtime?.progress, progressionLockedIds.has(tech.id));
              const color = categoryColors[tech.category];
              const end = getNodePoint(tech);
              const joint = getBranchJoint(corePoint, end);

              return (
                <g key={`core-${tech.id}`}>
                  <path className="tree-connection-shadow" d={getBranchPath(corePoint, end)} fill="none" stroke="rgba(0,0,0,0.42)" strokeWidth="11" strokeLinecap="round" strokeLinejoin="round" />
                  {status === "unlocked" ? <path className="tree-connection-glow" d={getBranchPath(corePoint, end)} fill="none" stroke={color} strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" /> : null}
                  <path
                    className={`tree-connection tree-connection-${status}`}
                    d={getBranchPath(corePoint, end)}
                    fill="none"
                    stroke={status === "locked" ? "rgba(148, 163, 184, 0.42)" : `${color}D8`}
                    strokeWidth={status === "locked" ? 5 : 7}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle className={`tree-joint tree-joint-${status}`} cx={joint.x} cy={joint.y} r="7" fill={status === "locked" ? "rgba(148, 163, 184, 0.42)" : color} />
                </g>
              );
            })}

            {technologies.map((tech) => {
                const parentId = visualParents[tech.id];
                if (!parentId) return null;
                const parent = technologies.find((item) => item.id === parentId);
                if (!parent) return null;

                const runtime = technologyRuntime[tech.id];
                const status = getStatus(tech, completedIds, runtime?.status, runtime?.progress, progressionLockedIds.has(tech.id));
                const color = categoryColors[tech.category];
                const start = getNodePoint(parent);
                const end = getNodePoint(tech);
                const joint = getBranchJoint(start, end);

                return (
                  <g key={`visual-${parentId}-${tech.id}`}>
                    <path className="tree-connection-shadow" d={getBranchPath(start, end)} fill="none" stroke="rgba(0,0,0,0.42)" strokeWidth="11" strokeLinecap="round" strokeLinejoin="round" />
                    {status === "unlocked" ? <path className="tree-connection-glow" d={getBranchPath(start, end)} fill="none" stroke={color} strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" /> : null}
                    <path
                      className={`tree-connection tree-connection-${status}`}
                      d={getBranchPath(start, end)}
                      fill="none"
                      stroke={status === "unlocked" ? color : status === "available" || status === "in_progress" ? `${color}D8` : "rgba(148, 163, 184, 0.42)"}
                      strokeWidth={status === "unlocked" ? 8 : status === "available" || status === "in_progress" ? 7 : 5}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <circle className={`tree-joint tree-joint-${status}`} cx={joint.x} cy={joint.y} r="6" fill={status === "locked" ? "rgba(148, 163, 184, 0.42)" : color} />
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
              <span className="text-sm font-black text-foreground">{translate(locale, "Life Core")}</span>
            </span>
          </button>

          {technologies.map((tech) => {
            const runtime = technologyRuntime[tech.id];
            const status = getStatus(tech, completedIds, runtime?.status, runtime?.progress, progressionLockedIds.has(tech.id));
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
                    {status === "unlocked" ? <span className="tech-completion-badge" role="img" aria-label={translate(locale, "Mission completed")} title={translate(locale, "Mission completed")}><Check /></span> : null}
                  </span>
                ) : (
                  <span className="tech-orb tech-emblem grid place-items-center border bg-card/95 backdrop-blur">
                    <span className="tech-emblem-inner" />
                    {status === "locked" ? <Lock size={23} /> : <TechnologyGlyph icon={tech.icon} size={27} />}
                    {status === "unlocked" ? <span className="tech-completion-badge" role="img" aria-label={translate(locale, "Mission completed")} title={translate(locale, "Mission completed")}><Check /></span> : null}
                    {runtime?.status === "active" ? <span className="absolute -right-1 -top-1 size-4 rounded-full bg-primary shadow-node" /> : null}
                    {cooldownActive ? <span className="absolute -bottom-1 -right-1 grid size-5 place-items-center rounded-full border border-border bg-background text-[9px]">cd</span> : null}
                  </span>
                )}
                <span className="tech-node-label line-clamp-2 text-[12px] font-black leading-tight text-foreground">{localizeTechnology(tech, locale).title}</span>
              </button>
            );
          })}
        </div>

        {panelOpen && selectedTechnology ? <MissionPanel anchor={panelAnchor} technology={selectedTechnology} now={now} onClose={closePanel} /> : null}
      </div>
    </div>
  );
}
