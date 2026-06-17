"use client";

import { Lock, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { technologies, categoryColors, categoryLabels } from "@/lib/life-tree";
import { useLifeStore } from "@/lib/store";
import { cn } from "@/lib/utils";

function getStatus(id: string, completedIds: string[], parents: string[]) {
  if (completedIds.includes(id)) return "unlocked";
  if (parents.every((parentId) => completedIds.includes(parentId))) return "available";
  return "locked";
}

export function LifeTree() {
  const completedIds = useLifeStore((state) => state.completedTechnologyIds);
  const unlockTechnology = useLifeStore((state) => state.unlockTechnology);

  return (
    <div className="strategy-panel overflow-hidden">
      <div className="flex gap-2 overflow-x-auto border-b border-border p-3">
        {Object.entries(categoryLabels).map(([id, label]) => (
          <div key={id} className="shrink-0 rounded-md border border-border bg-muted/40 px-3 py-2 text-xs font-bold" style={{ color: categoryColors[id as keyof typeof categoryColors] }}>
            {label}
          </div>
        ))}
      </div>
      <div className="strategy-grid relative h-[70vh] min-h-[560px] overflow-auto p-4">
        <div className="relative h-[2520px] w-[1500px]">
          <svg className="pointer-events-none absolute inset-0 size-full" aria-hidden="true">
            {technologies.flatMap((tech) =>
              tech.parents.map((parentId) => {
                const parent = technologies.find((item) => item.id === parentId);
                if (!parent) return null;
                const active = completedIds.includes(parentId) && completedIds.includes(tech.id);
                return (
                  <line
                    key={`${parentId}-${tech.id}`}
                    x1={parent.x + 92}
                    y1={parent.y + 44}
                    x2={tech.x + 8}
                    y2={tech.y + 44}
                    stroke={active ? "#4ce0d2" : "rgba(148, 163, 184, 0.22)"}
                    strokeWidth={active ? 3 : 2}
                    strokeDasharray={active ? "0" : "8 8"}
                  />
                );
              })
            )}
          </svg>
          {technologies.map((tech) => {
            const status = getStatus(tech.id, completedIds, tech.parents);
            const color = categoryColors[tech.category];
            return (
              <div
                key={tech.id}
                className={cn(
                  "absolute w-52 rounded-lg border bg-card/95 p-3 backdrop-blur transition",
                  status === "unlocked" && "node-glow",
                  status === "available" && "border-primary/70 shadow-node",
                  status === "locked" && "locked-node"
                )}
                style={{ left: tech.x, top: tech.y, borderColor: status === "locked" ? undefined : color }}
              >
                <div className="mb-2 flex items-start justify-between gap-2">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wide" style={{ color }}>
                      {tech.category}
                    </p>
                    <h3 className="mt-1 text-sm font-black text-foreground">{tech.title}</h3>
                  </div>
                  <div className="grid size-8 shrink-0 place-items-center rounded-md bg-muted">
                    {status === "locked" ? <Lock size={15} /> : <Sparkles size={15} style={{ color }} />}
                  </div>
                </div>
                <p className="min-h-10 text-xs leading-5 text-muted-foreground">{tech.description}</p>
                <div className="mt-3 space-y-1">
                  {tech.requirements.map((req) => (
                    <div key={req.label}>
                      <div className="mb-1 flex justify-between text-[10px] text-muted-foreground">
                        <span>{req.label}</span>
                        <span>{req.current}/{req.target}</span>
                      </div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                        <div className="h-full rounded-full" style={{ width: `${Math.min(100, (req.current / req.target) * 100)}%`, backgroundColor: color }} />
                      </div>
                    </div>
                  ))}
                </div>
                <Button className="mt-3 w-full" size="sm" variant={status === "available" ? "default" : "outline"} disabled={status !== "available"} onClick={() => unlockTechnology(tech.id)}>
                  {status === "unlocked" ? "Unlocked" : status === "available" ? `Unlock +${tech.xpReward} XP` : "Locked"}
                </Button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
