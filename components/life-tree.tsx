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

function MissionInputControl({ input, value, onChange }: { input: MissionInput; value?: MissionAnswer; onChange: (value: MissionAnswer) => void }) {
  const choices = input.choices ?? [];
  if (input.type === "singleChoice") return (
    <div className="grid gap-2">
      {choices.map((choice) => <button key={choice.id} type="button" className={cn("rounded-md border p-2.5 text-left text-xs transition", value === choice.id ? "border-primary bg-primary/10 text-foreground" : "border-border bg-background/45 text-muted-foreground")} onClick={() => onChange(choice.id)}><span className="font-bold">{choice.label}</span>{choice.description ? <span className="mt-1 block">{choice.description}</span> : null}</button>)}
      {input.allowCustomChoice ? <input className="h-10 rounded-md border border-border bg-background/60 px-3 text-xs outline-none focus:border-primary" placeholder="Other option" value={typeof value === "string" && !choices.some((choice) => choice.id === value) ? value : ""} onChange={(event) => onChange(event.target.value)} /> : null}
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
  const dailyMissions = useLifeStore((state) => state.dailyMissions);
  const globalMissionCooldownUntil = useLifeStore((state) => state.globalMissionCooldownUntil);
  const totalXp = useLifeStore((state) => state.totalXp);
  const insightPoints = useLifeStore((state) => state.insightPoints);
  const locale = useLifeStore((state) => state.locale);
  const activeAttemptId = useLifeStore((state) => state.activeMissionAttemptId);
  const activeAttempt = useLifeStore((state) => state.missionAttempts.find((attempt) => attempt.id === state.activeMissionAttemptId && attempt.technologyId === technology.id));
  const setMissionAnswer = useLifeStore((state) => state.setMissionAnswer);
  const localizedTechnology = localizeTechnology(technology, locale);
  const mission = getTechnologyMission(localizedTechnology);
  const definition = getMissionDefinition(localizedTechnology);
  const target = getTechnologyTarget(technology);
  const progress = runtime?.progress ?? technology.requirements[0]?.current ?? 0;
  const progressPercent = Math.min(100, (progress / target) * 100);
  const lockReasons = getTechnologyLockReasons(technology, { completedTechnologyIds: completedIds, totalXp, insightPoints });
  const status = getStatus(technology, completedIds, runtime?.status, progress, lockReasons.length > 0);
  const elapsedSeconds = runtime?.status === "active" && runtime.startedAt ? Math.max(0, Math.floor((now - runtime.startedAt) / 1000)) : 0;
  const remainingSeconds = Math.max(0, mission.minDurationSeconds - elapsedSeconds);
  const cooldownRemaining = runtime?.cooldownUntil ? Math.max(0, Math.floor((runtime.cooldownUntil - now) / 1000)) : 0;
  const globalCooldownRemaining = globalMissionCooldownUntil ? Math.max(0, Math.floor((globalMissionCooldownUntil - now) / 1000)) : 0;
  const anotherMissionActive = dailyMissions.some((item) => item.status === "active") || Object.entries(technologyRuntime).some(([id, item]) => id !== technology.id && item.status === "active");
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
          <p className="text-[11px] font-black uppercase tracking-wide" stãŽ¸¶‰žËkºwµçQÑ €¨€¸ÜÈ¤ì(€€€ÍÑÉ¥À¹ÍÉ½±±	ä¡ì±•™Ðè‘¥É•Ñ¥½¸€¨ÍÑ•À°‰•¡…Ù¥½Èè¥Í½µÁ…Ð€ü€‰…ÕÑ¼ˆ€è€‰Íµ½½Ñ ˆô¤ì(€ô((€™Õ¹Ñ¥½¸™½ÕÍQ•¡¹½±½ä¡Ñ• è1¥™•Q•¡¹½±½ä¤ì(€€€½¹ÍÐÉ•Ð€ôÍÑ…•I•˜¹ÕÉÉ•¹Ðü¹•Ñ	½Õ¹‘¥¹±¥•¹ÑI•Ð ¤ì(€€€½¹ÍÐÍÑ…•]¥‘Ñ €ôÉ•Ðü¹Ý¥‘Ñ €üü€ÌäÀì(€€€½¹ÍÐÍÑ…•!•¥¡Ð€ôÉ•Ðü¹¡•¥¡Ð€üü€ÜØÀì(€€€½¹ÍÐ¹½‘”€ô•Ñ9½‘•A½¥¹Ð¡Ñ• ¤ì(€€€½¹ÍÐÑ½ÁMÁ…”€ô€ààì(€€€½¹ÍÐ‰½ÑÑ½µ9…ÙMÁ…”€ô€äÈì(€€€½¹ÍÐ…É‘=™™Í•Ñ`€ôÍÑ…•]¥‘Ñ €øô€ÄÀÈÐ€ü€´ÄäÀ€è€Àì(€€€½¹ÍÐ…É‘=™™Í•Ñd€ôÍÑ…•]¥‘Ñ €øô€ÄÀÈÐ€ü€À€è€´ÄÄÀì(€€€½¹ÍÐ¹•áÑA…¸€ôì(€€€€€àè€´¡¹½‘”¹à€´½É•A½¥¹Ð¹à¤€¨™½ÕÍi½½´€¬…É‘=™™Í•Ñ`°(€€€€€äè€´¡¹½‘”¹ä€´½É•A½¥¹Ð¹ä¤€¨™½ÕÍi½½´€¬…É‘=™™Í•Ñd(€€€ôì(€€€½¹ÍÐÍÉ••¹`€ôÍÑ…•]¥‘Ñ €¼€È€¬¹•áÑA…¸¹à€¬€¡¹½‘”¹à€´½É•A½¥¹Ð¹à¤€¨™½ÕÍi½½´ì(€€€½¹ÍÐÍÉ••¹d€ôÍÑ…•!•¥¡Ð€¼€È€¬¹•áÑA…¸¹ä€¬€¡¹½‘”¹ä€´½É•A½¥¹Ð¹ä¤€¨™½ÕÍi½½´ì((€€€Í•ÑM•±•Ñ•‘%¡Ñ• ¹¥¤ì(€€€Í•ÑA…¹•±=Á•¸¡ÑÉÕ”¤ì(€€€Í•ÑY¥•Ü¡ìé½½´è™½ÕÍi½½´°Á…¸è¹•áÑA…¸ô¤ì(€€€Í•ÑA…¹•±¹¡½È¡ì(€€€€€àè±…µÀ¡ÍÉ••¹`€¬€ÔÐ°€ÄØ°5…Ñ ¹µ…à ÄØ°ÍÑ…•]¥‘Ñ €´€ÌäÈ¤¤°(€€€€€äè±…µÀ¡ÍÉ••¹d€´€ÄäÀ°Ñ½ÁMÁ…”°5…Ñ ¹µ…à¡Ñ½ÁMÁ…”°ÍÑ…•!•¥¡Ð€´‰½ÑÑ½µ9…ÙMÁ…”€´€ÐÌÀ¤¤(€€€ô¤ì(€ô((€™Õ¹Ñ¥½¸¡…¹‘±•9½‘•±¥¬¡Ñ• è1¥™•Q•¡¹½±½ä¤ì(€€€¥˜€ …Á…¹•±=Á•¸¤Í•ÑI•ÑÕÉ¹Y¥•Ü¡Ù¥•Ü¤ì(€€€™½ÕÍQ•¡¹½±½ä¡Ñ• ¤ì(€ô((€™Õ¹Ñ¥½¸±½Í•A…¹•° ¤ì(€€€Í•ÑA…¹•±=Á•¸¡™…±Í”¤ì(€€€Í•ÑM•±•Ñ•‘%¡¹Õ±°¤ì(€€€¥˜€¡É•ÑÕÉ¹Y¥•Ü¤Í•ÑY¥•Ü¡É•ÑÕÉ¹Y¥•Ü¤ì(€€€Í•ÑI•ÑÕÉ¹Y¥•Ü¡¹Õ±°¤ì(€ô((€™Õ¹Ñ¥½¸¡…¹‘±•]¡••°¡•Ù•¹Ðè]¡••±Ù•¹Ðñ!Q51¥Ù±•µ•¹Ðø¤ì(€€€¥˜€¡Á…¹•±=Á•¸¤É•ÑÕÉ¸ì(€€€•Ù•¹Ð¹ÁÉ•Ù•¹Ñ•™…Õ±Ð ¤ì(€€€½¹ÍÐÉ•Ð€ôÍÑ…•I•˜¹ÕÉÉ•¹Ðü¹•Ñ	½Õ¹‘¥¹±¥•¹ÑI•Ð ¤ì(€€€½¹ÍÐÍÑ…•]¥‘Ñ €ôÉ•Ðü¹Ý¥‘Ñ €üü€ÌäÀì(€€€½¹ÍÐÍÑ…•!•¥¡Ð€ôÉ•Ðü¹¡•¥¡Ð€üü€ÜØÀì(€€€½¹ÍÐ‘•±Ñ„€ô•Ù•¹Ð¹‘•±Ñ…d€ø€À€ü€´À¸Àà€è€À¸Ààì(€€€½¹ÍÐ¹•áÑi½½´€ô±…µÀ¡Ù¥•Ü¹é½½´€¬‘•±Ñ„°µ¥¹i½½´°µ…ái½½´¤ì(€€€½¹ÍÐé½½µI…Ñ¥¼€ô¹•áÑi½½´€¼Ù¥•Ü¹é½½´ì(€€€½¹ÍÐÁ½¥¹Ñ•É`€ô•Ù•¹Ð¹±¥•¹Ñ`€´€¡É•Ðü¹±•™Ð€üü€À¤€´ÍÑ…•]¥‘Ñ €¼€Èì(€€€½¹ÍÐÁ½¥¹Ñ•Éd€ô•Ù•¹Ð¹±¥•¹Ñd€´€¡É•Ðü¹Ñ½À€üü€À¤€´ÍÑ…•!•¥¡Ð€¼€Èì((€€€Í•ÑY¥•Ü¡ì(€€€€€é½½´è¹•áÑi½½´°(€€€€€Á…¸èì(€€€€€€€àèÁ½¥¹Ñ•É`€´€¡Á½¥¹Ñ•É`€´Ù¥•Ü¹Á…¸¹à¤€¨é½½µI…Ñ¥¼°(€€€€€€€äèÁ½¥¹Ñ•Éd€´€¡Á½¥¹Ñ•Éd€´Ù¥•Ü¹Á…¸¹ä¤€¨é½½µI…Ñ¥¼(€€€€€ô(€€€ô¤ì(€ô((€™Õ¹Ñ¥½¸¡…¹‘±•A½¥¹Ñ•É½Ý¸¡•Ù•¹ÐèA½¥¹Ñ•ÉÙ•¹Ðñ!Q51¥Ù±•µ•¹Ðø¤ì(€€€¥˜€¡•Ù•¹Ð¹‰ÕÑÑ½¸€„ôô€ÀñðÁ…¹•±=Á•¸¤É•ÑÕÉ¸ì(€€€•Ù•¹Ð¹ÕÉÉ•¹ÑQ…É•Ð¹Í•ÑA½¥¹Ñ•É…ÁÑÕÉ”¡•Ù•¹Ð¹Á½¥¹Ñ•É%¤ì(€€€Í•ÑÉ…MÑ…ÉÐ¡ìÁ½¥¹Ñ•É%è•Ù•¹Ð¹Á½¥¹Ñ•É%°àè•Ù•¹Ð¹±¥•¹Ñ`°äè•Ù•¹Ð¹±¥•¹Ñd°Á…¹`èÙ¥•Ü¹Á…¸¹à°Á…¹dèÙ¥•Ü¹Á…¸¹äô¤ì(€ô((€™Õ¹Ñ¥½¸¡…¹‘±•A½¥¹Ñ•É5½Ù”¡•Ù•¹ÐèA½¥¹Ñ•ÉÙ•¹Ðñ!Q51¥Ù±•µ•¹Ðø¤ì(€€€¥˜€ …‘É…MÑ…ÉÐñð‘É…MÑ…ÉÐ¹Á½¥¹Ñ•É%€„ôô•Ù•¹Ð¹Á½¥¹Ñ•É%¤É•ÑÕÉ¸ì(€€€½¹ÍÐ¹•áÑA…¸€ôìàè‘É…MÑ…ÉÐ¹Á…¹`€¬•Ù•¹Ð¹±¥•¹Ñ`€´‘É…MÑ…ÉÐ¹à°äè‘É…MÑ…ÉÐ¹Á…¹d€¬•Ù•¹Ð¹±¥•¹Ñd€´‘É…MÑ…ÉÐ¹äôì(€€€Á•¹‘¥¹É…A…¹I•˜¹ÕÉÉ•¹Ð€ô¹•áÑA…¸ì(€€€¥˜€¡‘É…É…µ•I•˜¹ÕÉÉ•¹Ð€„ôô¹Õ±°¤É•ÑÕÉ¸ì((€€€‘É…É…µ•I•˜¹ÕÉÉ•¹Ð€ôÝ¥¹‘½Ü¹É•ÅÕ•ÍÑ¹¥µ…Ñ¥½¹É…µ”  ¤€ôøì(€€€€€‘É…É…µ•I•˜¹ÕÉÉ•¹Ð€ô¹Õ±°ì(€€€€€½¹ÍÐÁ…¸€ôÁ•¹‘¥¹É…A…¹I•˜¹ÕÉÉ•¹Ðì(€€€€€½¹ÍÐ…¹Ù…Ì€ô…¹Ù…ÍI•˜¹ÕÉÉ•¹Ðì(€€€€€¥˜€ …Á…¸ñð€……¹Ù…Ì¤É•ÑÕÉ¸ì(€€€€€…¹Ù…Ì¹ÍÑå±”¹ÑÉ…¹Í™½É´€ôÍÑ…‰±•5½‰¥±•I•¹‘•É¥¹œ(€€€€€€€€üÑÉ…¹Í±…Ñ” ‘íÁ…¸¹áõÁà°€‘íÁ…¸¹åõÁà¤Í…±” ‘íÙ¥•ÝI•˜¹ÕÉÉ•¹Ð¹é½½µô¥€(€€€€€€€€èÑÉ…¹Í±…Ñ”Í ‘íÁ…¸¹áõÁà°€‘íÁ…¸¹åõÁà°€À¤Í…±” ‘íÙ¥•ÝI•˜¹ÕÉÉ•¹Ð¹é½½µô¥€ì(€€€€€½¹ÍÐ…ÉÑ1…å•È€ô…ÉÑ1…å•ÉI•˜¹ÕÉÉ•¹Ðì(€€€€€¥˜€¡…ÉÑ1…å•È€˜˜€…ÍÑ…‰±•5½‰¥±•I•¹‘•É¥¹œ¤ì(€€€€€€€½¹ÍÐÁ…É…±±…á`€ô±…µÀ¡Á…¸¹à€¨€À¸ÀÔÔ°€´ÜÈ°€ÜÈ¤ì(€€€€€€€½¹ÍÐÁ…É…±±…ád€ô±…µÀ¡Á…¸¹ä€¨€À¸ÀÔÔ°€´ÜÈ°€ÜÈ¤ì(€€€€€€€½¹ÍÐ‘•ÁÑ¡M…±”€ô€Ä¸ÀÄà€¬5…Ñ ¹µ…à À°Ù¥•ÝI•˜¹ÕÉÉ•¹Ð¹é½½´€´½Ù•ÉÙ¥•Ýi½½´¤€¨€À¸ÀÌÔì(€€€€€€€…ÉÑ1…å•È¹ÍÑå±”¹ÑÉ…¹Í™½É´€ôÑÉ…¹Í±…Ñ”Í ‘íÁ…É…±±…áaõÁà°€‘íÁ…É…±±…áeõÁà°€À¤Í…±” ‘í‘•ÁÑ¡M…±•ô¥€ì(€€€€€ô(€€€ô¤ì(€ô((€™Õ¹Ñ¥½¸¡…¹‘±•A½¥¹Ñ•ÉUÀ¡•Ù•¹ÐèA½¥¹Ñ•ÉÙ•¹Ðñ!Q51¥Ù±•µ•¹Ðø¤ì(€€€¥˜€¡‘É…MÑ…ÉÐü¹Á½¥¹Ñ•É%€„ôô•Ù•¹Ð¹Á½¥¹Ñ•É%¤É•ÑÕÉ¸ì(€€€¥˜€¡‘É…É…µ•I•˜¹ÕÉÉ•¹Ð€„ôô¹Õ±°¤ì(€€€€€Ý¥¹‘½Ü¹…¹•±¹¥µ…Ñ¥½¹É…µ”¡‘É…É…µ•I•˜¹ÕÉÉ•¹Ð¤ì(€€€€€‘É…É…µ•I•˜¹ÕÉÉ•¹Ð€ô¹Õ±°ì(€€€ô(€€€½¹ÍÐ™¥¹…±A…¸€ôÁ•¹‘¥¹É…A…¹I•˜¹ÕÉÉ•¹Ðì(€€€Á•¹‘¥¹É…A…¹I•˜¹ÕÉÉ•¹Ð€ô¹Õ±°ì(€€€¥˜€¡™¥¹…±A…¸¤Í•ÑY¥•Ü ¡ÕÉÉ•¹Ð¤€ôø€¡ì€¸¸¹ÕÉÉ•¹Ð°Á…¸è™¥¹…±A…¸ô¤¤ì(€€€Í•ÑÉ…MÑ…ÉÐ¡¹Õ±°¤ì(€ô((€É•ÑÕÉ¸€ (€€€€ñ‘¥Ø±…ÍÍ9…µ”ô‰±¥™”µÑÉ•”µÍ¡•±°¥µµ•ÉÍ¥Ù”µÑÉ•”µÍ¡•±°ˆø(€€€€€€ñ‘¥Ø±…ÍÍ9…µ”ô‰±¥™”µÑÉ•”µÑ½½±‰…È•Á½ µÑ½½±‰…Èˆø(€€€€€€€€ñ‘¥Ø±…ÍÍ9…µ”ô‰µ¥¸µÜ´Àˆø(€€€€€€€€€€ñÀ±…ÍÍ9…µ”ô‰Ñ•áÐµlÄÁÁát™½¹Ðµ‰±…¬ÕÁÁ•É…Í”ÑÉ…­¥¹œµlÀ¸ÈÉ•µtÑ•áÐµÁÉ¥µ…ÉäˆùíÑÉ…¹Í±…Ñ”¡±½…±”°€‰Q¡”Ý…­•¹¥¹œˆ¥ôð½Àø(€€€€€€€€€€ñÀ±…ÍÍ9…µ”ô‰Ñ•áÐµáÌÑ•áÐµµÕÑ•µ™½É•É½Õ¹ˆùíÑÉ…¹Í±…Ñ”¡±½…±”°€‰¡…ÁÑ•È€Ä€¼€ÄÈƒ
Ü…‰½ÕÐ€ÌÀ‘…åÌˆ¥ôð½Àø(€€€€€€€€ð½‘¥Øø(€€€€€€€€ñ‘¥Ø±…ÍÍ9…µ”ô‰•Á½ µ¹…Ù¥…Ñ¥½¸ˆø(€€€€€€€€€€ñ‰ÕÑÑ½¸ÑåÁ”ô‰‰ÕÑÑ½¸ˆ±…ÍÍ9…µ”ô‰•Á½ µÍÉ½±°µ‰ÕÑÑ½¸ˆ…É¥„µ±…‰•°ô‰AÉ•Ù¥½ÕÌ•Á½¡Ìˆ½¹±¥¬õì ¤€ôøÍÉ½±±Á½¡Ì ´Ä¥ôøñ¡•ÙÉ½¹1•™ÐÍ¥é”õìÄÙô€¼øð½‰ÕÑÑ½¸ø(€€€€€€€€€€ñ‘¥ØÉ•˜õí•Á½¡MÑÉ¥ÁI•™ô±…ÍÍ9…µ”ô‰•Á½ µÍÑÉ¥Àˆ…É¥„µ±…‰•°ô‰É„•Á½¡Ìˆø(€€€€€€€€€€€í•Á½¡Ì¹µ…À ¡•Á½ ¤€ôø€ (€€€€€€€€€€€€€€ñ‰ÕÑÑ½¸­•äõí•Á½ ¹¥‘ôÑåÁ”ô‰‰ÕÑÑ½¸ˆ‘¥Í…‰±•õì…•Á½ ¹Õ¹±½­•‘ô±…ÍÍ9…µ”õí¸ ‰•Á½ µ¡¥Àˆ°•Á½ ¹Õ¹±½­•€ü€‰…Ñ¥Ù”ˆ€è€‰±½­•ˆ¥ôø€(€€€€€€€€€€€€€€€€ñÍÁ…¸ùíÑÉ…¹Í±…Ñ”¡±½…±”°•Á½ ¹Ñ¥Ñ±”¥ôð½ÍÁ…¸ø(€€€€€€€€€€€€€€€€ñÍµ…±°ùíÑÉ…¹Í±…Ñ”¡±½…±”°•Á½ ¹‘ÕÉ…Ñ¥½¸¥ôð½Íµ…±°ø(€€€€€€€€€€€€€€ð½‰ÕÑÑ½¸ø(€€€€€€€€€€€€¤¥ô(€€€€€€€€€€ð½‘¥Øø(€€€€€€€€€€ñ‰ÕÑÑ½¸ÑåÁ”ô‰‰ÕÑÑ½¸ˆ±…ÍÍ9…µ”ô‰•Á½ µÍÉ½±°µ‰ÕÑÑ½¸ˆ…É¥„µ±…‰•°ô‰9•áÐ•Á½¡Ìˆ½¹±¥¬õì ¤€ôøÍÉ½±±Á½¡Ì Ä¥ôøñ¡•ÙÉ½¹I¥¡ÐÍ¥é”õìÄÙô€¼øð½‰ÕÑÑ½¸ø(€€€€€€€€ð½‘¥Øø(€€€€€€€€ñ‰ÕÑÑ½¸ÑåÁ”ô‰‰ÕÑÑ½¸ˆ±…ÍÍ9…µ”ô‰ÑÉ•”µÑ½½°µ‰ÕÑÑ½¸Í¡É¥¹¬´Àˆ…É¥„µ±…‰•°ô‰•¹Ñ•ÈÑÉ•”ˆ½¹±¥¬õíÉ•Í•ÑY¥•Ýôøñ1½…Ñ•¥á•Í¥é”õìÄÙô€¼øð½‰ÕÑÑ½¸ø(€€€€€€ð½‘¥Øø((€€€€€€ñ‘¥Ø(€€€€€€€É•˜õíÍÑ…•I•™ô(€€€€€€€±…ÍÍ9…µ”õí¸ ‰±¥™”µÑÉ•”µÍÑ…”ˆ°‘É…MÑ…ÉÐ€˜˜€‰¥Ìµ‘É…¥¹œˆ°Á…¹•±=Á•¸€˜˜€‰¥Ìµ™½ÕÍ•ˆ¥ô(€€€€€€€½¹]¡••°õí¡…¹‘±•]¡••±ô(€€€€€€€½¹A½¥¹Ñ•É½Ý¸õí¡…¹‘±•A½¥¹Ñ•É½Ý¹ô(€€€€€€€½¹A½¥¹Ñ•É5½Ù”õí¡…¹‘±•A½¥¹Ñ•É5½Ù•ô(€€€€€€€½¹A½¥¹Ñ•ÉUÀõí¡…¹‘±•A½¥¹Ñ•ÉUÁô(€€€€€€€½¹A½¥¹Ñ•É…¹•°õí¡…¹‘±•A½¥¹Ñ•ÉUÁô(€€€€€€ø(€€€€€€€€ñ‘¥ØÉ•˜õí…ÉÑ1…å•ÉI•™ô±…ÍÍ9…µ”ô‰±¥™”µÑÉ•”µ…ÉÐµ±…å•Èˆ…É¥„µ¡¥‘‘•¸ô‰ÑÉÕ”ˆø(€€€€€€€€€€ñ‘¥Ø±…ÍÍ9…µ”ô‰±¥™”µÑÉ•”µ…ÉÐµ¥µ…”ˆ€¼ø(€€€€€€€€€€ñ‘¥Ø±…ÍÍ9…µ”ô‰±¥™”µÑÉ•”µ…ÉÐµ…Ñµ½ÍÁ¡•É”ˆ€¼ø(€€€€€€€€ð½‘¥Øø((€€€€€€€€ñ‘¥Ø±…ÍÍ9…µ”ô‰±¥™”µÑÉ•”µÙ¥¹•ÑÑ”ˆ€¼ø(€€€€€€€€ñ‘¥Ø±…ÍÍ9…µ”ô‰±¥™”µÑÉ•”µÍÑ…É™¥•±ˆ€¼ø(€€€€€€€€ñ‘¥Ø±…ÍÍ9…µ”ô‰±¥™”µÑÉ•”µÉÕ¹”µÉ¥ˆ€¼ø((€€€€€€€€ñ‘¥Ø(€€€€€€€€€É•˜õí…¹Ù…ÍI•™ô(€€€€€€€€€±…ÍÍ9…µ”ô‰±¥™”µÑÉ•”µ…¹Ù…Ìˆ(€€€€€€€€€ÍÑå±”õíìÝ¥‘Ñ èÑÉ••M¥é”°¡•¥¡ÐèÑÉ••M¥é”°lˆ´µÑÉ•”µ¡…±˜ˆ…ÌÍÑÉ¥¹tè€´‘íÑÉ••M¥é”€¼€ÉõÁá€°ÑÉ…¹Í™½É´èÍÑ…‰±•5½‰¥±•I•¹‘•É¥¹œ€üÑÉ…¹Í±…Ñ” ‘íÙ¥•Ü¹Á…¸¹áõÁà°€‘íÙ¥•Ü¹Á…¸¹åõÁà¤Í…±” ‘íÙ¥•Ü¹é½½µô¥€€èÑÉ…¹Í±…Ñ”Í ‘íÙ¥•Ü¹Á…¸¹áõÁà°€‘íÙ¥•Ü¹Á…¸¹åõÁà°€À¤Í…±” ‘íÙ¥•Ü¹é½½µô¥€õô(€€€€€€€€ø(€€€€€€€€€€ñÍÙœ±…ÍÍ9…µ”ô‰Á½¥¹Ñ•Èµ•Ù•¹ÑÌµ¹½¹”…‰Í½±ÕÑ”¥¹Í•Ð´ÀÍ¥é”µ™Õ±°ˆÙ¥•Ý	½àõí€À€À€‘íÑÉ••M¥é•ô€‘íÑÉ••M¥é•õô…É¥„µ¡¥‘‘•¸ô‰ÑÉÕ”ˆø(€€€€€€€€€€€€ñ‘•™Ìø(€€€€€€€€€€€€€€ñÉ…‘¥…±É…‘¥•¹Ð¥ô‰½É•ÕÉ„ˆàôˆÔÀ”ˆäôˆÔÀ”ˆÈôˆÔÀ”ˆø(€€€€€€€€€€€€€€€€ñÍÑ½À½™™Í•ÐôˆÀ”ˆÍÑ½Á½±½Èô‰É‰„ ÈÐØ°€ÄäØ°€àÌ°€À¸ÌÐ¤ˆ€¼ø(€€€€€€€€€€€€€€€€ñÍÑ½À½™™Í•ÐôˆÐÔ”ˆÍÑ½Á½±½Èô‰É‰„ ÜØ°€ÈÈÐ°€ÈÄÀ°€À¸ÄÌ¤ˆ€¼ø(€€€€€€€€€€€€€€€€ñÍÑ½À½™™Í•ÐôˆÄÀÀ”ˆÍÑ½Á½±½Èô‰É‰„ ÜØ°€ÈÈÐ°€ÈÄÀ°€À¤ˆ€¼ø(€€€€€€€€€€€€€€ð½É…‘¥…±É…‘¥•¹Ðø(€€€€€€€€€€€€ð½‘•™Ìø(€€€€€€€€€€€€ñ¥É±”àõí½É•A½¥¹Ð¹áôäõí½É•A½¥¹Ð¹åôÈôˆÔØÀˆ™¥±°ô‰ÕÉ° ½É•ÕÉ„¤ˆ€¼ø(€€€€€€€€€€€€ñ¥É±”àõí½É•A½¥¹Ð¹áôäõí½É•A½¥¹Ð¹åôÈôˆÌØÀˆ™¥±°ô‰¹½¹”ˆÍÑÉ½­”ô‰É‰„ ÈÔÔ°ÈÔÔ°ÈÔÔ°À¸ÀØ¤ˆÍÑÉ½­•…Í¡…ÉÉ…äôˆÌ€Äàˆ€¼ø(€€€€€€€€€€€€ñ¥É±”àõí½É•A½¥¹Ð¹áôäõí½É•A½¥¹Ð¹åôÈôˆÜØÀˆ™¥±°ô‰¹½¹”ˆÍÑÉ½­”ô‰É‰„ ÈÔÔ°ÈÔÔ°ÈÔÔ°À¸ÀÐÔ¤ˆÍÑÉ½­•…Í¡…ÉÉ…äôˆÈ€ÈÈˆ€¼ø(€€€€€€€€€€€€ñ¥É±”àõí½É•A½¥¹Ð¹áôäõí½É•A½¥¹Ð¹åôÈôˆÄÄÐÀˆ™¥±°ô‰¹½¹”ˆÍÑÉ½­”ô‰É‰„ ÈÔÔ°ÈÔÔ°ÈÔÔ°À¸ÀÌÔ¤ˆÍÑÉ½­•…Í¡…ÉÉ…äôˆÈ€ÈØˆ€¼ø(€€€€€€€€€€€€ñ¥É±”àõí½É•A½¥¹Ð¹áôäõí½É•A½¥¹Ð¹åôÈôˆÄÔÀÀˆ™¥±°ô‰¹½¹”ˆÍÑÉ½­”ô‰É‰„ ÈÐØ°ÄäØ°àÌ°À¸ÀÈÔ¤ˆÍÑÉ½­•…Í¡…ÉÉ…äôˆÄ€ÌÀˆ€¼ø((€€€€€€€€€€€íÉ½½ÑQ•¡¹½±½¥•Ì¹µ…À ¡Ñ• ¤€ôøì(€€€€€€€€€€€€€½¹ÍÐÉÕ¹Ñ¥µ”€ôÑ•¡¹½±½åIÕ¹Ñ¥µ•mÑ• ¹¥‘tì(€€€€€€€€€€€€€½¹ÍÐÍÑ…ÑÕÌ€ô•ÑMÑ…ÑÕÌ¡Ñ• °½µÁ±•Ñ•‘%‘Ì°ÉÕ¹Ñ¥µ”ü¹ÍÑ…ÑÕÌ°ÉÕ¹Ñ¥µ”ü¹ÁÉ½É•ÍÌ°ÁÉ½É•ÍÍ¥½¹1½­•‘%‘Ì¹¡…Ì¡Ñ• ¹¥¤¤ì(€€€€€€€€€€€€€½¹ÍÐ½±½È€ô…Ñ•½Éå½±½ÉÍmÑ• ¹…Ñ•½Éåtì(€€€€€€€€€€€€€½¹ÍÐ•¹€ô•Ñ9½‘•A½¥¹Ð¡Ñ• ¤ì(€€€€€€€€€€€€€½¹ÍÐ©½¥¹Ð€ô•Ñ	É…¹¡)½¥¹Ð¡½É•A½¥¹Ð°•¹¤ì((€€€€€€€€€€€€€É•ÑÕÉ¸€ (€€€€€€€€€€€€€€€€ñœ­•äõí½É”´‘íÑ• ¹¥‘õôø(€€€€€€€€€€€€€€€€€€ñÁ…Ñ ±…ÍÍ9…µ”ô‰ÑÉ•”µ½¹¹•Ñ¥½¸µÍ¡…‘½Üˆõí•Ñ	É…¹¡A…Ñ ¡½É•A½¥¹Ð°•¹¥ô™¥±°ô‰¹½¹”ˆÍÑÉ½­”ô‰É‰„ À°À°À°À¸ÐÈ¤ˆÍÑÉ½­•]¥‘Ñ ôˆÄÄˆÍÑÉ½­•1¥¹•…Àô‰É½Õ¹ˆÍÑÉ½­•1¥¹•©½¥¸ô‰É½Õ¹ˆ€¼ø(€€€€€€€€€€€€€€€€€íÍÑ…ÑÕÌ€ôôô€‰Õ¹±½­•ˆ€ü€ñÁ…Ñ ±…ÍÍ9…µ”ô‰ÑÉ•”µ½¹¹•Ñ¥½¸µ±½Üˆõí•Ñ	É…¹¡A…Ñ ¡½É•A½¥¹Ð°•¹¥ô™¥±°ô‰¹½¹”ˆÍÑÉ½­”õí½±½ÉôÍÑÉ½­•]¥‘Ñ ôˆÄØˆÍÑÉ½­•1¥¹•…Àô‰É½Õ¹ˆÍÑÉ½­•1¥¹•©½¥¸ô‰É½Õ¹ˆ€¼ø€è¹Õ±±ô(€€€€€€€€€€€€€€€€€€ñÁ…Ñ (€€€€€€€€€€€€€€€€€€€±…ÍÍ9…µ”õíÑÉ•”µ½¹¹•Ñ¥½¸ÑÉ•”µ½¹¹•Ñ¥½¸´‘íÍÑ…ÑÕÍõô(€€€€€€€€€€€€€€€€€€€õí•Ñ	É…¹¡A…Ñ ¡½É•A½¥¹Ð°•¹¥ô(€€€€€€€€€€€€€€€€€€€™¥±°ô‰¹½¹”ˆ(€€€€€€€€€€€€€€€€€€€ÍÑÉ½­”õíÍÑ…ÑÕÌ€ôôô€‰±½­•ˆ€ü€‰É‰„ ÄÐà°€ÄØÌ°€ÄàÐ°€À¸ÐÈ¤ˆ€è€‘í½±½Éõáô(€€€€€€€€€€€€€€€€€€€ÍÑÉ½­•]¥‘Ñ õíÍÑ…ÑÕÌ€ôôô€‰±½­•ˆ€ü€Ô€è€Ýô(€€€€€€€€€€€€€€€€€€€ÍÑÉ½­•1¥¹•…Àô‰É½Õ¹ˆ(€€€€€€€€€€€€€€€€€€€ÍÑÉ½­•1¥¹•©½¥¸ô‰É½Õ¹ˆ(€€€€€€€€€€€€€€€€€€¼ø(€€€€€€€€€€€€€€€€€€ñ¥É±”±…ÍÍ9…µ”õíÑÉ•”µ©½¥¹ÐÑÉ•”µ©½¥¹Ð´‘íÍÑ…ÑÕÍõôàõí©½¥¹Ð¹áôäõí©½¥¹Ð¹åôÈôˆÜˆ™¥±°õíÍÑ…ÑÕÌ€ôôô€‰±½­•ˆ€ü€‰É‰„ ÄÐà°€ÄØÌ°€ÄàÐ°€À¸ÐÈ¤ˆ€è½±½Éô€¼ø(€€€€€€€€€€€€€€€€ð½œø(€€€€€€€€€€€€€€¤ì(€€€€€€€€€€€ô¥ô((€€€€€€€€€€€íÑ•¡¹½±½¥•Ì¹µ…À ¡Ñ• ¤€ôøì(€€€€€€€€€€€€€€€½¹ÍÐÁ…É•¹Ñ%€ôÙ¥ÍÕ…±A…É•¹ÑÍmÑ• ¹¥‘tì(€€€€€€€€€€€€€€€¥˜€ …Á…É•¹Ñ%¤É•ÑÕÉ¸¹Õ±°ì(€€€€€€€€€€€€€€€½¹ÍÐÁ…É•¹Ð€ôÑ•¡¹½±½¥•Ì¹™¥¹ ¡¥Ñ•´¤€ôø¥Ñ•´¹¥€ôôôÁ…É•¹Ñ%¤ì(€€€€€€€€€€€€€€€¥˜€ …Á…É•¹Ð¤É•ÑÕÉ¸¹Õ±°ì((€€€€€€€€€€€€€€€½¹ÍÐÉÕ¹Ñ¥µ”€ôÑ•¡¹½±½åIÕ¹Ñ¥µ•mÑ• ¹¥‘tì(€€€€€€€€€€€€€€€½¹ÍÐÍÑ…ÑÕÌ€ô•ÑMÑ…ÑÕÌ¡Ñ• °½µÁ±•Ñ•‘%‘Ì°ÉÕ¹Ñ¥µ”ü¹ÍÑ…ÑÕÌ°ÉÕ¹Ñ¥µ”ü¹ÁÉ½É•ÍÌ°ÁÉ½É•ÍÍ¥½¹1½­•‘%‘Ì¹¡…Ì¡Ñ• ¹¥¤¤ì(€€€€€€€€€€€€€€€½¹ÍÐ½±½È€ô…Ñ•½Éå½±½ÉÍmÑ• ¹…Ñ•½Éåtì(€€€€€€€€€€€€€€€½¹ÍÐÍÑ…ÉÐ€ô•Ñ9½‘•A½¥¹Ð¡Á…É•¹Ð¤ì(€€€€€€€€€€€€€€€½¹ÍÐ•¹€ô•Ñ9½‘•A½¥¹Ð¡Ñ• ¤ì(€€€€€€€€€€€€€€€½¹ÍÐ©½¥¹Ð€ô•Ñ	É…¹¡)½¥¹Ð¡ÍÑ…ÉÐ°•¹¤ì((€€€€€€€€€€€€€€€É•ÑÕÉ¸€ (€€€€€€€€€€€€€€€€€€ñœ­•äõíÙ¥ÍÕ…°´‘íÁ…É•¹Ñ%‘ô´‘íÑ• ¹¥‘õôø(€€€€€€€€€€€€€€€€€€€€ñÁ…Ñ ±…ÍÍ9…µ”ô‰ÑÉ•”µ½¹¹•Ñ¥½¸µÍ¡…‘½Üˆõí•Ñ	É…¹¡A…Ñ ¡ÍÑ…ÉÐ°•¹¥ô™¥±°ô‰¹½¹”ˆÍÑÉ½­”ô‰É‰„ À°À°À°À¸ÐÈ¤ˆÍÑÉ½­•]¥‘Ñ ôˆÄÄˆÍÑÉ½­•1¥¹•…Àô‰É½Õ¹ˆÍÑÉ½­•1¥¹•©½¥¸ô‰É½Õ¹ˆ€¼ø(€€€€€€€€€€€€€€€€€€€íÍÑ…ÑÕÌ€ôôô€‰Õ¹±½­•ˆ€ü€ñÁ…Ñ ±…ÍÍ9…µ”ô‰ÑÉ•”µ½¹¹•Ñ¥½¸µ±½Üˆõí•Ñ	É…¹¡A…Ñ ¡ÍÑ…ÉÐ°•¹¥ô™¥±°ô‰¹½¹”ˆÍÑÉ½­”õí½±½ÉôÍÑÉ½­•]¥‘Ñ ôˆÄØˆÍÑÉ½­•1¥¹•…Àô‰É½Õ¹ˆÍÑÉ½­•1¥¹•©½¥¸ô‰É½Õ¹ˆ€¼ø€è¹Õ±±ô(€€€€€€€€€€€€€€€€€€€€ñÁ…Ñ (€€€€€€€€€€€€€€€€€€€€€±…ÍÍ9…µ”õíÑÉ•”µ½¹¹•Ñ¥½¸ÑÉ•”µ½¹¹•Ñ¥½¸´‘íÍÑ…ÑÕÍõô(€€€€€€€€€€€€€€€€€€€€€õí•Ñ	É…¹¡A…Ñ ¡ÍÑ…ÉÐ°•¹¥ô(€€€€€€€€€€€€€€€€€€€€€™¥±°ô‰¹½¹”ˆ(€€€€€€€€€€€€€€€€€€€€€ÍÑÉ½­”õíÍÑ…ÑÕÌ€ôôô€‰Õ¹±½­•ˆ€ü½±½È€èÍÑ…ÑÕÌ€ôôô€‰…Ù…¥±…‰±”ˆñðÍÑ…ÑÕÌ€ôôô€‰¥¹}ÁÉ½É•ÍÌˆ€ü€‘í½±½Éõá€€è€‰É‰„ ÄÐà°€ÄØÌ°€ÄàÐ°€À¸ÐÈ¤‰ô(€€€€€€€€€€€€€€€€€€€€€ÍÑÉ½­•]¥‘Ñ õíÍÑ…ÑÕÌ€ôôô€‰Õ¹±½­•ˆ€ü€à€èÍÑ…ÑÕÌ€ôôô€‰…Ù…¥±…‰±”ˆñðÍÑ…ÑÕÌ€ôôô€‰¥¹}ÁÉ½É•ÍÌˆ€ü€Ü€è€Õô(€€€€€€€€€€€€€€€€€€€€€ÍÑÉ½­•1¥¹•…Àô‰É½Õ¹ˆ(€€€€€€€€€€€€€€€€€€€€€ÍÑÉ½­•1¥¹•©½¥¸ô‰É½Õ¹ˆ(€€€€€€€€€€€€€€€€€€€€¼ø(€€€€€€€€€€€€€€€€€€€€ñ¥É±”±…ÍÍ9…µ”õíÑÉ•”µ©½¥¹ÐÑÉ•”µ©½¥¹Ð´‘íÍÑ…ÑÕÍõôàõí©½¥¹Ð¹áôäõí©½¥¹Ð¹åôÈôˆØˆ™¥±°õíÍÑ…ÑÕÌ€ôôô€‰±½­•ˆ€ü€‰É‰„ ÄÐà°€ÄØÌ°€ÄàÐ°€À¸ÐÈ¤ˆ€è½±½Éô€¼ø(€€€€€€€€€€€€€€€€€€ð½œø(€€€€€€€€€€€€€€€€¤ì(€€€€€€€€€€€€€ô¥ô(€€€€€€€€€€ð½ÍÙœø((€€€€€€€€€€ñ‰ÕÑÑ½¸(€€€€€€€€€€€ÑåÁ”ô‰‰ÕÑÑ½¸ˆ(€€€€€€€€€€€±…ÍÍ9…µ”ô‰±¥™”µ½É”µ¹½‘”ˆ(€€€€€€€€€€€ÍÑå±”õíì±•™Ðè½É•A½¥¹Ð¹à€´€ÜÐ°Ñ½Àè½É•A½¥¹Ð¹ä€´€ÜÐõô(€€€€€€€€€€€½¹A½¥¹Ñ•É½Ý¸õì¡•Ù•¹Ð¤€ôø•Ù•¹Ð¹ÍÑ½ÁAÉ½Á……Ñ¥½¸ ¥ô(€€€€€€€€€€€½¹±¥¬õíÉ•Í•ÑY¥•Ýô(€€€€€€€€€€ø(€€€€€€€€€€€€ñÍÁ…¸±…ÍÍ9…µ”ô‰±¥™”µ½É”µ…ÉÐˆ…É¥„µ¡¥‘‘•¸ô‰ÑÉÕ”ˆ€¼ø(€€€€€€€€€€€€ñMÁ…É­±•Ì±…ÍÍ9…µ”ô‰±¥™”µ½É”µ±åÁ ˆÍ¥é”õìÌÙô…É¥„µ¡¥‘‘•¸ô‰ÑÉÕ”ˆ€¼ø(€€€€€€€€€€€€ñÍÁ…¸±…ÍÍ9…µ”ô‰±¥™”µ½É”µ½Áäˆø(€€€€€€€€€€€€€€ñÍÁ…¸±…ÍÍ9…µ”ô‰Ñ•áÐµlåÁát™½¹Ðµ‰±…¬ÕÁÁ•É…Í”ÑÉ…­¥¹œµlÀ¸ÈÑ•µtÑ•áÐµ…•¹Ðˆù!…‰¥‘½¼ð½ÍÁ…¸ø(€€€€€€€€€€€€€€ñÍÁ…¸±…ÍÍ9…µ”ô‰Ñ•áÐµÍ´™½¹Ðµ‰±…¬Ñ•áÐµ™½É•É½Õ¹ˆùíÑÉ…¹Í±…Ñ”¡±½…±”°€‰1¥™”½É”ˆ¥ôð½ÍÁ…¸ø(€€€€€€€€€€€€ð½ÍÁ…¸ø(€€€€€€€€€€ð½‰ÕÑÑ½¸ø((€€€€€€€€€íÑ•¡¹½±½¥•Ì¹µ…À ¡Ñ• ¤€ôøì(€€€€€€€€€€€½¹ÍÐÉÕ¹Ñ¥µ”€ôÑ•¡¹½±½åIÕ¹Ñ¥µ•mÑ• ¹¥‘tì(€€€€€€€€€€€½¹ÍÐÍÑ…ÑÕÌ€ô•ÑMÑ…ÑÕÌ¡Ñ• °½µÁ±•Ñ•‘%‘Ì°ÉÕ¹Ñ¥µ”ü¹ÍÑ…ÑÕÌ°ÉÕ¹Ñ¥µ”ü¹ÁÉ½É•ÍÌ°ÁÉ½É•ÍÍ¥½¹1½­•‘%‘Ì¹¡…Ì¡Ñ• ¹¥¤¤ì(€€€€€€€€€€€½¹ÍÐ½±½È€ô…Ñ•½Éå½±½ÉÍmÑ• ¹…Ñ•½Éåtì(€€€€€€€€€€€½¹ÍÐ¥ÍM•±•Ñ•€ôÍ•±•Ñ•‘Q•¡¹½±½äü¹¥€ôôôÑ• ¹¥ì(€€€€€€€€€€€½¹ÍÐ½½±‘½Ý¹Ñ¥Ù”€ôÉÕ¹Ñ¥µ”ü¹½½±‘½Ý¹U¹Ñ¥°€üÉÕ¹Ñ¥µ”¹½½±‘½Ý¹U¹Ñ¥°€ø¹½Ü€è™…±Í”ì(€€€€€€€€€€€½¹ÍÐÁ½Í¥Ñ¥½¸€ôÉ…‘¥…±A½Í¥Ñ¥½¹ÍmÑ• ¹¥‘t€üüìàèÑ• ¹à°äèÑ• ¹äôì(€€€€€€€€€€€½¹ÍÐ¥ÍA½±…ÉMÑ…È€ôÑ• ¹¥€ôôô€‰…Ý…­•¹¥¹œµÑÉ¥…°ˆì((€€€€€€€€€€€É•ÑÕÉ¸€ (€€€€€€€€€€€€€€ñ‰ÕÑÑ½¸(€€€€€€€€€€€€€€€­•äõíÑ• ¹¥‘ô(€€€€€€€€€€€€€€€ÑåÁ”ô‰‰ÕÑÑ½¸ˆ(€€€€€€€€€€€€€€€±…ÍÍ9…µ”õí¸ ‰Ñ• µ¹½‘”µ‰ÕÑÑ½¸É…‘¥…°µÑ• µ¹½‘”…‰Í½±ÕÑ”™±•àÜ´ÌÈ™±•àµ½°¥Ñ•µÌµ•¹Ñ•È…À´ÈÑ•áÐµ•¹Ñ•ÈÑÉ…¹Í¥Ñ¥½¸ˆ°ÍÑ…ÑÕÌ°¥ÍM•±•Ñ•€˜˜€‰Í•±•Ñ•ˆ°¥ÍA½±…ÉMÑ…È€˜˜€‰Á½±…ÈµÍÑ…Èµ¹½‘”ˆ¥ô(€€€€€€€€€€€€€€€‘…Ñ„µ…Ñ•½ÉäõíÑ• ¹…Ñ•½Éåô(€€€€€€€€€€€€€€€‘…Ñ„µÑ• µ¥õíÑ• ¹¥‘ô(€€€€€€€€€€€€€€€‘…Ñ„µ¹½‘”µÉ½±”õíÁ½Í¥Ñ¥½¸¹É½±•ô(€€€€€€€€€€€€€€€‘…Ñ„µ¹½‘”µÑåÁ”õíÑ• ¹ÑåÁ”€üü€‰Ñ•¡¹½±½ä‰ô(€€€€€€€€€€€€€€€ÍÑå±”õíì±•™ÐèÁ½Í¥Ñ¥½¸¹à°Ñ½ÀèÁ½Í¥Ñ¥½¸¹ä°lˆ´µ¹½‘”µ½±½Èˆ…ÌÍÑÉ¥¹tè½±½È°lˆ´µ¹½‘”µÍ¥é”ˆ…ÌÍÑÉ¥¹tè€‘íÁ½Í¥Ñ¥½¸¹Í¥é•õÁá€õô(€€€€€€€€€€€€€€€½¹A½¥¹Ñ•É½Ý¸õì¡•Ù•¹Ð¤€ôø•Ù•¹Ð¹ÍÑ½ÁAÉ½Á……Ñ¥½¸ ¥ô(€€€€€€€€€€€€€€€½¹±¥¬õì ¤€ôø¡…¹‘±•9½‘•±¥¬¡Ñ• ¥ô(€€€€€€€€€€€€€€ø(€€€€€€€€€€€€€€€í¥ÍA½±…ÉMÑ…È€ü€ (€€€€€€€€€€€€€€€€€€ñÍÁ…¸±…ÍÍ9…µ”ô‰Á½±…ÈµÍÑ…Èµ…ÉÐˆø(€€€€€€€€€€€€€€€€€€€€ñÍÁ…¸±…ÍÍ9…µ”ô‰Á½±…ÈµÍÑ…Èµ™…”ˆ…É¥„µ¡¥‘‘•¸ô‰ÑÉÕ”ˆ€¼ø(€€€€€€€€€€€€€€€€€€€íÍÑ…ÑÕÌ€ôôô€‰Õ¹±½­•ˆ€ü€ñÍÁ…¸±…ÍÍ9…µ”ô‰Ñ• µ½µÁ±•Ñ¥½¸µ‰…‘”ˆÉ½±”ô‰¥µœˆ…É¥„µ±…‰•°ô‰5¥ÍÍ¥½¸½µÁ±•Ñ•ˆÑ¥Ñ±”ô‰5¥ÍÍ¥½¸½µÁ±•Ñ•ˆøñ¡•¬€¼øð½ÍÁ…¸ø€è¹Õ±±ô(€€€€€€€€€€€€€€€€€€ð½ÍÁ…¸ø(€€€€€€€€€€€€€€€€¤€è€ (€€€€€€€€€€€€€€€€€€ñÍÁ…¸±…ÍÍ9…µ”ô‰Ñ• µ½ÉˆÑ• µ•µ‰±•´É¥Á±…”µ¥Ñ•µÌµ•¹Ñ•È‰½É‘•È‰œµ…É¼äÔ‰…­‘É½Àµ‰±ÕÈˆø(€€€€€€€€€€€€€€€€€€€€ñÍÁ…¸±…ÍÍ9…µ”ô‰Ñ• µ•µ‰±•´µ¥¹¹•Èˆ€¼ø(€€€€€€€€€€€€€€€€€€€íÍÑ…ÑÕÌ€ôôô€‰±½­•ˆ€ü€ñ1½¬Í¥é”õìÈÍô€¼ø€è€ñQ•¡¹½±½å±åÁ ¥½¸õíÑ• ¹¥½¹ôÍ¥é”õìÈÝô€¼ùô(€€€€€€€€€€€€€€€€€€€íÍÑ…ÑÕÌ€ôôô€‰Õ¹±½­•ˆ€ü€ñÍÁ…¸±…ÍÍ9…µ”ô‰Ñ• µ½µÁ±•Ñ¥½¸µ‰…‘”ˆÉ½±”ô‰¥µœˆ…É¥„µ±…‰•°ô‰5¥ÍÍ¥½¸½µÁ±•Ñ•ˆÑ¥Ñ±”ô‰5¥ÍÍ¥½¸½µÁ±•Ñ•ˆøñ¡•¬€¼øð½ÍÁ…¸ø€è¹Õ±±ô(€€€€€€€€€€€€€€€€€€€íÉÕ¹Ñ¥µ”ü¹ÍÑ…ÑÕÌ€ôôô€‰…Ñ¥Ù”ˆ€ü€ñÍÁ…¸±…ÍÍ9…µ”ô‰…‰Í½±ÕÑ”€µÉ¥¡Ð´Ä€µÑ½À´ÄÍ¥é”´ÐÉ½Õ¹‘•µ™Õ±°‰œµÁÉ¥µ…ÉäÍ¡…‘½Üµ¹½‘”ˆ€¼ø€è¹Õ±±ô(€€€€€€€€€€€€€€€€€€€í½½±‘½Ý¹Ñ¥Ù”€ü€ñÍÁ…¸±…ÍÍ9…µ”ô‰…‰Í½±ÕÑ”€µ‰½ÑÑ½´´Ä€µÉ¥¡Ð´ÄÉ¥Í¥é”´ÔÁ±…”µ¥Ñ•µÌµ•¹Ñ•ÈÉ½Õ¹‘•µ™Õ±°‰½É‘•È‰½É‘•Èµ‰½É‘•È‰œµ‰…­É½Õ¹Ñ•áÐµlåÁátˆùð½ÍÁ…¸ø€è¹Õ±±ô(€€€€€€€€€€€€€€€€€€ð½ÍÁ…¸ø(€€€€€€€€€€€€€€€€¥ô(€€€€€€€€€€€€€€€€ñÍÁ…¸±…ÍÍ9…µ”ô‰Ñ• µ¹½‘”µ±…‰•°±¥¹”µ±…µÀ´ÈÑ•áÐµlÄÉÁát™½¹Ðµ‰±…¬±•…‘¥¹œµÑ¥¡ÐÑ•áÐµ™½É•É½Õ¹ˆùí±½…±¥é•Q•¡¹½±½ä¡Ñ• °±½…±”¤¹Ñ¥Ñ±•ôð½ÍÁ…¸ø(€€€€€€€€€€€€€€ð½‰ÕÑÑ½¸ø(€€€€€€€€€€€€¤ì(€€€€€€€€€ô¥ô(€€€€€€€€ð½‘¥Øø((€€€€€€€íÁ…¹•±=Á•¸€˜˜Í•±•Ñ•‘Q•¡¹½±½ä€ü€ñ5¥ÍÍ¥½¹A…¹•°…¹¡½ÈõíÁ…¹•±¹¡½ÉôÑ•¡¹½±½äõíÍ•±•Ñ•‘Q•¡¹½±½åô¹½Üõí¹½Ýô½¹±½Í”õí±½Í•A…¹•±ô€¼ø€è¹Õ±±ô(€€€€€€ð½‘¥Øø(€€€€ð½‘¥Øø(€€¤ì)ô(