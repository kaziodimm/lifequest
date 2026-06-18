"use client";

import { useEffect, useState } from "react";
import { Award, Flame, GitBranch, Languages, Palette, Trophy } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { locales } from "@/lib/i18n";
import { streakMilestones } from "@/lib/milestones";
import { levelFromXp, lifeScore } from "@/lib/progression";
import { useLifeStore } from "@/lib/store";
import { Locale } from "@/lib/types";
import { defaultTreeThemeId, treeThemes, type TreeThemeId } from "@/lib/tree-themes";
import { applySiteTheme, readSiteTheme } from "@/lib/site-theme";
import { cn } from "@/lib/utils";

export default function ProfilePage() {
  const state = useLifeStore();
  const level = levelFromXp(state.totalXp);
  const score = lifeScore(state);
  const [siteTheme, setSiteTheme] = useState<TreeThemeId>(defaultTreeThemeId);

  useEffect(() => setSiteTheme(readSiteTheme()), []);

  function selectTheme(themeId: TreeThemeId) {
    setSiteTheme(themeId);
    applySiteTheme(themeId);
  }

  return (
    <AppShell>
      <div className="mb-4">
        <p className="mb-2 text-xs font-bold uppercase tracking-wide text-primary">Commander Profile</p>
        <h1 className="text-2xl font-black text-foreground">{state.avatarName}</h1>
        <p className="mt-2 text-sm text-muted-foreground">Your profile represents real-life strategic development.</p>
      </div>

      <section className="grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Trophy size={18} className="text-strategy-gold" />Level {level.level}</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid aspect-square place-items-center rounded-lg border border-primary/30 bg-primary/10 text-6xl font-black text-primary shadow-node">H</div>
            <Progress value={level.progress} />
            <p className="text-sm text-muted-foreground">Life Score: <span className="font-bold text-foreground">{score}</span></p>
          </CardContent>
        </Card>

        <div className="grid gap-4">
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><GitBranch size={18} className="text-primary" />Unlocked Technologies</CardTitle></CardHeader>
            <CardContent><p className="text-3xl font-black">{state.completedTechnologyIds.length}</p></CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Award size={18} className="text-secondary" />Achievements</CardTitle></CardHeader>
            <CardContent className="grid gap-2">
              {state.achievements.map((achievement) => (
                <div key={achievement.id} className="rounded-md border border-border bg-muted/40 p-3">
                  <p className="font-bold text-foreground">{achievement.title}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{achievement.description}</p>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Flame size={18} className="text-strategy-red" />Streak Milestones</CardTitle></CardHeader>
            <CardContent className="grid gap-2">
              {streakMilestones.map((milestone) => {
                const unlocked = state.streak >= milestone.days;
                return (
                  <div key={milestone.days} className={cn("rounded-md border p-3", unlocked ? "border-strategy-red/60 bg-strategy-red/10" : "border-border bg-muted/30") }>
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-bold text-foreground">{milestone.title}</p>
                      <span className="text-xs font-black text-muted-foreground">{milestone.days}d</span>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">{milestone.description}</p>
                  </div>
                );
              })}
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Languages size={18} className="text-primary" />Language</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {locales.map((locale) => (
                <Button key={locale.id} variant={state.locale === locale.id ? "default" : "outline"} size="sm" onClick={() => state.setLocale(locale.id as Locale)}>
                  {locale.label}
                </Button>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Palette size={18} className="text-strategy-gold" />Visual Style</CardTitle></CardHeader>
            <CardContent className="grid gap-2">
              {treeThemes.map((theme) => (
                <button
                  key={theme.id}
                  type="button"
                  onClick={() => selectTheme(theme.id)}
                  className={cn("theme-choice rounded-md border p-3 text-left transition hover:border-primary", siteTheme === theme.id ? "border-primary bg-primary/10" : "border-border bg-muted/30")}
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-bold text-foreground">{theme.title}</p>
                    <span className="rounded bg-muted px-2 py-1 text-[10px] font-bold uppercase text-muted-foreground">{siteTheme === theme.id ? "active" : theme.shortTitle}</span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{theme.description}</p>
                </button>
              ))}
            </CardContent>
          </Card>
        </div>
      </section>
    </AppShell>
  );
}
