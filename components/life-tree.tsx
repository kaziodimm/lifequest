"use client";

import { useState } from "react";
import type { LucideIcon } from "lucide-react";
import { Brain, BriefcaseBusiness, Check, HeartPulse, Landmark, Lock, Palette, Rocket, Sparkles, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { technologies, categoryColors, categoryLabels } from "@/lib/life-tree";
import { useLifeStore } from "@/lib/store";
import type { LifeCategory } from "@/lib/types";
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

function getStatus(id: string, completedIds: string[], parents: string[]) {
  if (completedIds.includes(id)) return "unlocked";
  if (parents.every((parentId) => completedIds.includes(parentId))) return "available";
  return "locked";
}

function getConnectionPath(parentX: number, parentY: number, childX: number, childY: number) {
  const startX = parentX + 224;
  const startY = parentY + 70;
  const endX = childX;
  const endY = childY + 70;
  const controlOffset = Math.max(90, Math.abs(endX - startX) * 0.45);

  return `M ${startX} ${startY} C ${startX + controlOffset} ${startY}, ${endX - controlOffset} ${endY}, ${endX} ${endY}`;
}

export function LifeTree() {
  const [lastUnlockedId, setLastUnlockedId] = useState<string | null>(null);
  const completedIds = useLifeStore((state) => state.completedTechnologyIds);
  const unlockTechnology = useLifeStore((state) => state.unlockTechnology);

  function handleUnlock(technologyId: string) {
    unlockTechnology(technologyId);
    setLastUnlockedId(technologyId);
    window.setTimeout(() => setLastUnlockedId(null), 1200);
  }

  return (
    <div className="strategy-panel overflow-hidden">
      <div className="flex gap-2 overflow-x-auto border-b border-border bg-background/35 p-3">
        {Object.entries(categoryLabels).map(([id, label]) => {
          const category = id as LifeCategory;
          const Icon = categoryIcons[category];
          const color = categoryColors[category];

          return (
            <div key={id} className="shrink-0 rounded-md border border-border bg-muted/40 px-3 py-2 text-xs font-bold" style={{ color, boxShadow: `inset 0 0 18px ${color}18` }}>
              <span className="flex items-center gap-2">
                <Icon size={14} />
                {label}
              </span>
            </div>
          );
        })}
      </div>
      <div className="strategy-grid life-map-bg relative h-[72vh] min-h-[620px] overflow-auto p-4">
        <div className="relative h-[2520px] w-[1500px]">
          {categoryBands.map((band) => {
            const color = categoryColors[band.id];
            const Icon = categoryIcons[band.id];

            return (
              <div
                key={band.id}
                className="pointer-events-none absolute left-0 rounded-lg border border-dashed px-5 py-4"
                style={{ top: band.y, width: 1440, height: band.height, borderColor: `${color}22`, background: `linear-gradient(90deg, ${color}12, transparent 38%, ${color}08)` }}
              >
                <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.18em]" style={{ color }}>
                  <Icon size={15} />
                  {categoryLabels[band.id]} sector
                </div>
              </div>
            );
          })}

          <svg className="pointer-events-none absolute inset-0 size-full" aria-hidden="true">
            <defs>
              <filter id="connectionGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            {technologies.flatMap((tech) =>
              tech.parents.map((parentId) => {
                const parent = technologies.find((item) => item.id === parentId);
                if (!parent) return null;

                const parentUnlocked = completedIds.includes(parentId);
                const techUnlocked = completedIds.includes(tech.id);
                const techAvailable = parentUnlocked && tech.parents.every((id) => completedIds.includes(id));
                const color = categoryColors[tech.category];

                return (
                  <path
                    key={`${parentId}-${tech.id}`}
                    d={getConnectionPath(parent.x, parent.y, tech.x, tech.y)}
                    fill="none"
                    stroke={techUnlocked ? color : techAvailable ? `${color}AA` : "rgba(148, 163, 184, 0.18)"}
                    strokeWidth={techUnlocked ? 4 : techAvailable ? 3 : 2}
                    strokeDasharray={techUnlocked ? "0" : techAvailable ? "10 10" : "5 12"}
                    strokeLinecap="round"
                    filter={techUnlocked || techAvailable ? "url(#connectionGlow)" : undefined}
                  />
                );
              })
            )}
          </svg>

          {technologies.map((tech) => {
            const status = getStatus(tech.id, completedIds, tech.parents);
            const color = categoryColors[tech.category];
            const Icon = categoryIcons[tech.category];
            const progress = Math.max(...tech.requirements.map((req) => Math.min(100, (req.current / req.target) * 100)));
            const isBursting = lastUnlockedId === tech.id;

            return (
              <div
                key={tech.id}
                className={cn("tech-node absolute w-56 rounded-lg border bg-card/95 p-3 backdrop-blur transition", status, isBursting && "unlock-burst")}
                style={{ left: tech.x, top: tech.y, borderColor: status === "locked" ? undefined : color, ["--node-color" as string]: color }}
              >
                {isBursting ? (
                  <div className="pointer-events-none absolute inset-0 z-20">
                    {Array.from({ length: 8 }).map((_, index) => <span key={index} className="research-particle" />)}
                  </div>
                ) : null}

                <div className="mb-2 flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-wide" style={{ color }}>
                      {categoryLabels[tech.category]}
                    </p>
                    <h3 className="mt-1 text-sm font-black text-foreground">{tech.title}</h3>
                  </div>
                  <div className="node-emblem grid size-9 shrink-0 place-items-center rounded-md border bg-muted/70" style={{ color, borderColor: `${color}55` }}>
                    {status === "locked" ? <Lock size={16} /> : status === "unlocked" ? <Check size={17} /> : <Icon size={17} />}
                  </div>
                </div>

                <p className="min-h-10 text-xs leading-5 text-muted-foreground">{tech.description}</p>

                <div className="mt-3 space-y-1.5">
                  {tech.requirements.map((req) => (
                    <div key={req.label}>
                      <div className="mb-1 flex justify-between gap-2 text-[10px] text-muted-foreground">
                        <span className="truncate">{req.label}</span>
                        <span>{req.current}/{req.target}</span>
                      </div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                        <div className="h-full rounded-full transition-all" style={{ width: `${Math.min(100, (req.current / req.target) * 100)}%`, backgroundColor: color }} />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-3 flex items-center justify-between text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
                  <span>{Math.round(progress)}% researched</span>
                  <span>+{tech.xpReward} XP</span>
                </div>

                <Button className="mt-3 w-full" size="sm" variant={status === "available" ? "default" : "outline"} disabled={status !== "available"} onClick={() => handleUnlock(tech.id)}>
                  <Sparkles size={15} />
                  {status === "unlocked" ? "Unlocked" : status === "available" ? "Research" : "Locked"}
                </Button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
