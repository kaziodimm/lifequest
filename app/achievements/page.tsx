"use client";

import Link from "next/link";
import { Award, CheckCircle2, LockKeyhole, PackageOpen, Sparkles } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { inventoryCatalog } from "@/lib/game-shell";
import { achievementText, gameShellT, itemText } from "@/lib/game-shell-copy";
import { translate } from "@/lib/i18n";
import { lifeScore } from "@/lib/progression";
import { useLifeStore } from "@/lib/store";

export default function AchievementsPage() {
  const state = useLifeStore();
  const achievements = state.achievements;
  const unlocked = achievements.filter((achievement) => achievement.unlocked);
  const locked = achievements.filter((achievement) => !achievement.unlocked);
  const unlockedItems = inventoryCatalog.filter((item) => state.unlockedInventoryItemIds.includes(item.id));

  return (
    <AppShell>
      <div className="mb-4">
        <p className="mb-2 text-xs font-bold uppercase tracking-wide text-primary">{translate(state.locale, "Progress Archive")}</p>
        <h1 className="text-2xl font-black text-foreground">{gameShellT(state.locale, "Achievement Archive")}</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">{translate(state.locale, "Milestones should feel like evidence that your Life Tree is becoming real.")}</p>
      </div>

      <section className="grid gap-4 lg:grid-cols-[0.88fr_1.12fr]">
        <div className="grid gap-4">
          <Card className="border-primary/30 bg-primary/5">
            <CardHeader><CardTitle className="flex items-center gap-2"><Award size={18} className="text-primary" />{translate(state.locale, "Life Score")}</CardTitle></CardHeader>
            <CardContent>
              <p className="text-4xl font-black text-foreground">{lifeScore(state)}</p>
              <p className="mt-2 text-sm text-muted-foreground">{translate(state.locale, "Built from unlocked technologies and milestone medals.")}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><PackageOpen size={18} className="text-primary" />{gameShellT(state.locale, "Inventory Archive")}</CardTitle></CardHeader>
            <CardContent className="grid gap-2">
              {unlockedItems.length ? unlockedItems.map((item) => {
                const text = itemText(state.locale, item);
                return (
                  <div key={item.id} className="rounded-xl border border-border bg-muted/25 p-3">
                    <p className="text-sm font-black text-foreground">{text.title}</p>
                    <p className="mt-1 text-xs leading-5 text-muted-foreground">{text.description}</p>
                  </div>
                );
              }) : <p className="text-sm text-muted-foreground">{gameShellT(state.locale, "No items yet")}</p>}
              <Button asChild variant="outline" className="mt-2"><Link href="/rewards"><Sparkles size={16} />{gameShellT(state.locale, "Rewards & Shop")}</Link></Button>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4">
          <Card>
            <CardHeader><CardTitle>{gameShellT(state.locale, "Unlocked")}</CardTitle></CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-2">
              {unlocked.length ? unlocked.map((achievement) => {
                const text = achievementText(state.locale, achievement);
                const rewards = inventoryCatalog.filter((item) => achievement.rewardItemIds?.includes(item.id));
                return (
                  <div key={achievement.id} className="rounded-xl border border-primary/50 bg-primary/10 p-4">
                    <div className="mb-3 flex items-start justify-between gap-3">
                      <p className="font-black text-foreground">{text.title}</p>
                      <CheckCircle2 size={18} className="shrink-0 text-primary" />
                    </div>
                    <p className="text-sm leading-6 text-muted-foreground">{text.description}</p>
                    {rewards.length ? <p className="mt-3 text-xs font-bold text-primary">{rewards.map((item) => itemText(state.locale, item).title).join(" · ")}</p> : null}
                  </div>
                );
              }) : <p className="text-sm text-muted-foreground">{translate(state.locale, "Special awards appear here after milestones and Trial.")}</p>}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>{gameShellT(state.locale, "Locked")}</CardTitle></CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-2">
              {locked.map((achievement) => {
                const text = achievementText(state.locale, achievement);
                return (
                  <div key={achievement.id} className="rounded-xl border border-border bg-muted/20 p-4 opacity-85">
                    <div className="mb-3 flex items-start justify-between gap-3">
                      <p className="font-black text-foreground">{text.title}</p>
                      <LockKeyhole size={18} className="shrink-0 text-muted-foreground" />
                    </div>
                    <p className="text-sm leading-6 text-muted-foreground">{text.description}</p>
                    {achievement.hiddenReward ? <p className="mt-3 text-xs font-bold text-muted-foreground">{gameShellT(state.locale, "Hidden reward")}: {gameShellT(state.locale, "Reward revealed after unlock.")}</p> : null}
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>
      </section>
    </AppShell>
  );
}
