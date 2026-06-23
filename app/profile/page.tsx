"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, GitBranch, Languages, LockKeyhole, Palette, RotateCcw, Trophy } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { locales, translate } from "@/lib/i18n";
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
  const [resetArmed, setResetArmed] = useState(false);

  useEffect(() => setSiteTheme(readSiteTheme()), []);

  function selectTheme(themeId: TreeThemeId) {
    setSiteTheme(themeId);
    applySiteTheme(themeId, state.unlockedTreeThemeIds.includes(themeId));
  }

  return (
    <AppShell>
      <div className="mb-4">
        <p className="mb-2 text-xs font-bold uppercase tracking-wide text-primary">{translate(state.locale, "Commander Profile")}</p>
        <h1 className="text-2xl font-black text-foreground">{translate(state.locale, state.avatarName)}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{translate(state.locale, "Your profile represents real-life strategic development.")}</p>
      </div>

      <section className="grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Trophy size={18} className="text-strategy-gold" />{translate(state.locale, "Level")} {level.level}</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid aspect-square place-items-center rounded-lg border border-primary/30 bg-primary/10 text-6xl font-black text-primary shadow-node">H</div>
            <Progress value={level.progress} />
            <p className="text-sm text-muted-foreground">{translate(state.locale, "Life Score")}: <span className="font-bold text-foreground">{score}</span></p>
          </CardContent>
        </Card>

        <div className="grid gap-4">
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><GitBranch size={18} className="text-primary" />{translate(state.locale, "Unlocked Technologies")}</CardTitle></CardHeader>
            <CardContent><p className="text-3xl font-black">{state.completedTechnologyIds.length}</p></CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Languages size={18} className="text-primary" />{translate(state.locale, "Language")}</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {locales.map((locale) => (
                <Button key={locale.id} variant={state.locale === locale.id ? "default" : "outline"} size="sm" onClick={() => state.setLocale(locale.id as Locale)}>
                  {locale.label}
                </Button>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Palette size={18} className="text-strategy-gold" />{translate(state.locale, "Visual Style")}</CardTitle></CardHeader>
            <CardContent className="grid gap-2">
              {treeThemes.map((theme) => (
                <button
                  key={theme.id}
                  type="button"
                  onClick={() => selectTheme(theme.id)}
                  className={cn("theme-choice rounded-md border p-3 text-left transition hover:border-primary", siteTheme === theme.id ? "border-primary bg-primary/10" : "border-border bg-muted/30", !state.unlockedTreeThemeIds.includes(theme.id) && "opacity-70")}
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-bold text-foreground">{translate(state.locale, theme.title)}</p>
                    <span className="flex items-center gap-1 rounded bg-muted px-2 py-1 text-[10px] font-bold uppercase text-muted-foreground">
                      {!state.unlockedTreeThemeIds.includes(theme.id) ? <LockKeyhole size={11} /> : null}
                      {siteTheme === theme.id ? translate(state.locale, state.unlockedTreeThemeIds.includes(theme.id) ? "active" : "preview") : state.unlockedTreeThemeIds.includes(theme.id) ? translate(state.locale, theme.shortTitle) : translate(state.locale, "locked")}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{translate(state.locale, theme.description)}</p>
                  {!state.unlockedTreeThemeIds.includes(theme.id) && theme.unlock.rewardSource ? <p className="mt-2 text-[11px] font-semibold text-primary">{translate(state.locale, "Unlock:")} {translate(state.locale, theme.unlock.rewardSource)}</p> : null}
                </button>
              ))}
            </CardContent>
          </Card>
          <Card className="border-destructive/35">
            <CardHeader><CardTitle className="flex items-center gap-2"><AlertTriangle size={18} className="text-destructive" />{translate(state.locale, "Reset local progress")}</CardTitle></CardHeader>
            <CardContent className="grid gap-3">
              <p className="text-sm leading-6 text-muted-foreground">{translate(state.locale, "This deletes local onboarding, missions, attempts, focus objects, XP, Research, Insight, awards and statistics on this device.")}</p>
              {!resetArmed ? <Button variant="outline" onClick={() => setResetArmed(true)}><RotateCcw size={16} />{translate(state.locale, "I want to reset")}</Button> : <div className="grid gap-2 sm:grid-cols-2"><Button variant="outline" className="border-destructive text-destructive hover:bg-destructive/10" onClick={() => { state.resetLocalProgress(); window.location.href = "/"; }}><RotateCcw size={16} />{translate(state.locale, "Confirm reset")}</Button><Button variant="outline" onClick={() => setResetArmed(false)}>{translate(state.locale, "Cancel")}</Button></div>}
            </CardContent>
          </Card>
        </div>
      </section>
    </AppShell>
  );
}
