"use client";

import { Compass } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { LifeTree } from "@/components/life-tree";
import { Card, CardContent } from "@/components/ui/card";
import { availableTechnologies } from "@/lib/insights";
import { useLifeStore } from "@/lib/store";

export default function TreePage() {
  const state = useLifeStore();
  const available = availableTechnologies(state);

  return (
    <AppShell>
      <div className="mb-4">
        <p className="mb-2 text-xs font-bold uppercase tracking-wide text-primary">Core System</p>
        <h1 className="text-2xl font-black text-foreground">Life Technology Tree</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">Research real-life technologies by completing missions. Locked nodes show future potential, glowing nodes show unlocked progress.</p>
      </div>
      <Card className="mb-4 border-primary/30 bg-primary/5">
        <CardContent className="flex flex-col gap-2 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="grid size-10 place-items-center rounded-md bg-primary/15 text-primary"><Compass size={18} /></div>
            <div>
              <p className="font-bold text-foreground">{available.length} technologies ready for research</p>
              <p className="text-xs text-muted-foreground">Scroll the map, inspect requirements, then unlock available nodes.</p>
            </div>
          </div>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Zoom controls planned</p>
        </CardContent>
      </Card>
      <LifeTree />
    </AppShell>
  );
}
