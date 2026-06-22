"use client";

import { Award, CheckCircle2, Lock } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLifeStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { translate } from "@/lib/i18n";

export default function AchievementsPage() {
  const achievements = useLifeStore((state) => state.achievements);
  const completedTechnologyIds = useLifeStore((state) => state.completedTechnologyIds);
  const locale = useLifeStore((state) => state.locale);

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
            <p className="text-4xl font-black text-foreground">{completedTechnologyIds.length * 100 + achievements.filter((item) => item.unlocked).length * 50}</p>
            <p className="mt-2 text-sm text-muted-foreground">{translate(locale, "Built from unlocked technologies and milestone medals.")}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>{translate(locale, "Milestone Medals")}</CardTitle></CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            {achievements.map((achievement) => (
              <div key={achievement.id} className={cn("rounded-lg border p-4", achievement.unlocked ? "border-primary/50 bg-primary/10" : "border-border bg-muted/35 opacity-70")}>
                <div className="mb-3 flex items-center justify-between gap-3">
                  <p className="font-black text-foreground">{achievement.title}</p>
                  {achievement.unlocked ? <CheckCircle2 size={18} className="text-primary" /> : <Lock size={18} className="text-muted-foreground" />}
                </div>
                <p className="text-sm leading-6 text-muted-foreground">{achievement.description}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </AppShell>
  );
}
