"use client";

import { Award, GitBranch, Languages, Palette, Trophy } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { locales } from "@/lib/i18n";
import { levelFromXp, lifeScore } from "@/lib/progression";
import { useLifeStore } from "@/lib/store";
import { visualThemes } from "@/lib/themes";
import { Locale, VisualThemeId } from "@/lib/types";
import { cn } from "@/lib/utils";

export default function ProfilePage() {
  const state = useLifeStore();
  const level = levelFromXp(state.totalXp);
  const score = lifeScore(state);

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
              {visualThemes.map((theme) => (
                <button
                  key={theme.id}
                  type="button"
                  onClick={() => state.setTheme(theme.id as VisualThemeId)}
                  className={cn("rounded-md border p-3 text-left transition hover:border-primary", state.theme === theme.id ? "border-primary bg-primary/10" : "border-border bg-muted/30")}
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-bold text-foreground">{theme.name}</p>
                    <span className="rounded bg-muted px-2 py-1 text-[10px] font-bold uppercase text-muted-foreground">{theme.availableInMvp ? "active" : "reserved"}</span>
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
