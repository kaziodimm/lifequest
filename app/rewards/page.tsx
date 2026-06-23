"use client";

import { Gift, LockKeyhole, Sparkles } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { gameShellT } from "@/lib/game-shell-copy";
import { categoryLabels } from "@/lib/life-tree";
import { useLifeStore } from "@/lib/store";
import { translate } from "@/lib/i18n";

const futureCategories = ["Profile frames", "Badges", "Titles", "Effects", "Special challenges"];

export default function RewardsPage() {
  const state = useLifeStore();

  return (
    <AppShell>
      <div className="mb-4">
        <p className="mb-2 text-xs font-bold uppercase tracking-wide text-primary">{gameShellT(state.locale, "Rewards & Shop")}</p>
        <h1 className="text-2xl font-black text-foreground">{gameShellT(state.locale, "Shop coming soon")}</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">{gameShellT(state.locale, "Your currencies are ready, but spending is disabled during closed beta.")}</p>
      </div>

      <section className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <Card className="border-primary/30 bg-primary/5">
          <CardHeader><CardTitle className="flex items-center gap-2"><Sparkles size={18} className="text-primary" />{translate(state.locale, "Research")}</CardTitle></CardHeader>
          <CardContent className="grid gap-2 sm:grid-cols-2">
            {Object.entries(state.researchPoints).map(([category, amount]) => (
              <div key={category} className="rounded-xl border border-border bg-background/45 p-3">
                <p className="text-xs font-bold text-muted-foreground">{translate(state.locale, categoryLabels[category as keyof typeof categoryLabels])}</p>
                <p className="mt-1 text-2xl font-black text-foreground">{amount}</p>
              </div>
            ))}
            <div className="rounded-xl border border-primary/30 bg-primary/10 p-3 sm:col-span-2">
              <p className="text-xs font-bold text-muted-foreground">{translate(state.locale, "Insight")}</p>
              <p className="mt-1 text-2xl font-black text-foreground">{state.insightPoints}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Gift size={18} className="text-primary" />{gameShellT(state.locale, "Future rewards")}</CardTitle></CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            {futureCategories.map((category) => (
              <div key={category} className="rounded-xl border border-border bg-muted/25 p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-black text-foreground">{gameShellT(state.locale, category)}</p>
                  <LockKeyhole size={16} className="text-muted-foreground" />
                </div>
                <p className="mt-2 text-xs leading-5 text-muted-foreground">{gameShellT(state.locale, "Shop coming soon")}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </AppShell>
  );
}
