"use client";

import { Award, CheckCircle2 } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLifeStore } from "@/lib/store";
import { translate } from "@/lib/i18n";

export default function AchievementsPage() {
  const completedTechnologyIds = useLifeStore((state) => state.completedTechnologyIds);
  const earnedBadges = useLifeStore((state) => state.earnedBadges);
  const earnedTitles = useLifeStore((state) => state.earnedTitles);
  const locale = useLifeStore((state) => state.locale);
  const awards = [...earnedBadges.map((item) => ({ id: `badge:${item}`, title: item, type: "Badge" })), ...earnedTitles.map((item) => ({ id: `title:${item}`, title: item, type: "Title" }))];

  return (
    <AppShell>
      <div className="mb-4">
        <p className="mb-2 text-xs font-bold uppercase tracking-wide text-primary">{translate(locale, "Progress Archive")}</p>
        <h1 className="text-2xl font-black text-foreground">{translate(locale, "Achievements")}</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">{translate(locale, "Milestones should feel like evidence that your Life Tree is becoming real.")}</p>
      </div>

      <section className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <Card className="border-primary/30 bg-primary/5">
          <CardHeader><CardTitle className="flex items-center gap-2"><Award size={18} className="text-primary" />{translate(locale, "Life Score")}</CardTitle></CardHeader>
          <CardContent>
            <p className="text-4xl font-black text-foreground">{completedTechnologyIds.length * 100 + awards.length * 50}</p>
            <p className="mt-2 text-sm text-muted-foreground">{translate(locale, "Built from unlocked technologies and milestone medals.")}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>{translate(locale, "Milestone Medals")}</CardTitle></CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            {awards.length ? awards.map((achievement) => (
              <div key={achievement.id} className="rounded-lg border border-primary/50 bg-primary/10 p-4">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <p className="font-black text-foreground">{translate(locale, achievement.title)}</p>
                  <CheckCircle2 size={18} className="text-primary" />
                </div>
                <p className="text-sm leading-6 text-muted-foreground">{translate(locale, achievement.type)}</p>
              </div>
            )) : <p className="text-sm text-muted-foreground">{translate(locale, "Special awards appear here after milestones and Trial.")}</p>}
          </CardContent>
        </Card>
      </section>
    </AppShell>
  );
}
