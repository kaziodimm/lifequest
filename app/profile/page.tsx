"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, BadgeCheck, GitBranch, Languages, LockKeyhole, PackageOpen, Palette, RotateCcw, Shield, Sparkles, Trophy } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { CloudAccountPanel } from "@/components/cloud-account-panel";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { inventoryCatalog } from "@/lib/game-shell";
import { gameShellT, itemText } from "@/lib/game-shell-copy";
import { locales, translate } from "@/lib/i18n";
import { getLevelProgress, lifeScore } from "@/lib/progression";
import { useLifeStore } from "@/lib/store";
import { InventoryItem, Locale } from "@/lib/types";
import { defaultTreeThemeId, treeThemes, type TreeThemeId } from "@/lib/tree-themes";
import { applySiteTheme, readSiteTheme } from "@/lib/site-theme";
import { cn } from "@/lib/utils";

const localeLabels: Record<Locale, string> = { en: "English", ru: "Русский", cs: "Čeština", uk: "Українська" };

function InventoryCard({ item, equipped, locale, onEquip, onUnequip }: { item: InventoryItem; equipped: boolean; locale: Locale; onEquip: () => void; onUnequip: () => void }) {
  const text = itemText(locale, item);
  return (
    <div className={cn("rounded-xl border bg-muted/25 p-3", equipped ? "border-primary/60 bg-primary/10" : "border-border")}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-black text-foreground">{text.title}</p>
          <p className="mt-1 text-xs leading-5 text-muted-foreground">{text.description}</p>
        </div>
        <span className="rounded-full border border-border bg-background/60 px-2 py-1 text-[10px] font-black uppercase text-muted-foreground">{item.rarity}</span>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {equipped ? <Button size="sm" variant="outline" onClick={onUnequip}>{gameShellT(locale, "Unequip")}</Button> : <Button size="sm" onClick={onEquip}>{gameShellT(locale, "Equip")}</Button>}
        {equipped ? <span className="inline-flex items-center gap-1 rounded-full bg-primary/15 px-2 py-1 text-[10px] font-black text-primary"><BadgeCheck size={12} />{gameShellT(locale, "Equipped")}</span> : null}
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const state = useLifeStore();
  const level = getLevelProgress(state.totalXp);
  const score = lifeScore(state);
  const [siteTheme, setSiteTheme] = useState<TreeThemeId>(defaultTreeThemeId);
  const [resetArmed, setResetArmed] = useState(false);
  const unlockedItems = useMemo(() => inventoryCatalog.filter((item) => state.unlockedInventoryItemIds.includes(item.id)), [state.unlockedInventoryItemIds]);
  const equippedBadge = unlockedItems.find((item) => item.id === state.equippedBadgeId);
  const equippedFrame = unlockedItems.find((item) => item.id === state.equippedFrameId);
  const equippedTitle = unlockedItems.find((item) => item.id === state.equippedTitleId);

  useEffect(() => setSiteTheme(readSiteTheme()), []);

  function selectTheme(themeId: TreeThemeId) {
    setSiteTheme(themeId);
    applySiteTheme(themeId, state.unlockedTreeThemeIds.includes(themeId));
  }

  return (
    <AppShell>
      <div className="mb-4">
        <p className="mb-2 text-xs font-bold uppercase tracking-wide text-primary">{translate(state.locale, "Commander Profile")}</p>
        <h1 className="text-2xl font-black text-foreground">{gameShellT(state.locale, "Profile Identity")}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{translate(state.locale, "Your profile represents real-life strategic development.")}</p>
      </div>

      <section className="grid gap-4 lg:grid-cols-[0.82fr_1.18fr]">
        <div className="grid gap-4">
          <Card className={cn("overflow-hidden", equippedFrame ? "border-primary/60 shadow-[0_0_42px_rgba(246,196,83,.14)]" : "")}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Trophy size={18} className="text-strategy-gold" />{gameShellT(state.locale, "Foundation Level")} {level.level}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative grid aspect-square place-items-center overflow-hidden rounded-2xl border border-primary/30 bg-[radial-gradient(circle_at_50%_20%,rgba(246,196,83,.18),transparent_32%),linear-gradient(145deg,rgba(76,224,210,.12),rgba(0,0,0,.18))] text-6xl font-black text-primary shadow-node">
                <span className="absolute inset-4 rounded-[1.4rem] border border-white/10" />
                <span className="relative">H</span>
                {equippedFrame ? <span className="absolute bottom-3 rounded-full border border-primary/50 bg-background/70 px-3 py-1 text-[10px] font-black uppercase tracking-wide text-primary">{itemText(state.locale, equippedFrame).title}</span> : null}
              </div>
              {equippedTitle ? <p className="text-center text-sm font-black text-primary">{itemText(state.locale, equippedTitle).title}</p> : null}
              {equippedBadge ? <p className="flex items-center justify-center gap-2 text-center text-xs font-bold text-muted-foreground"><Shield size={14} className="text-primary" />{itemText(state.locale, equippedBadge).title}</p> : null}
              <Progress value={level.progress} />
              <p className="text-sm text-muted-foreground">{gameShellT(state.locale, "XP to next level")}: <span className="font-bold text-foreground">{Math.max(0, level.needed - level.current)}</span></p>
              <p className="text-sm text-muted-foreground">{translate(state.locale, "Life Score")}: <span className="font-bold text-foreground">{score}</span></p>
              <Button asChild variant="outline" className="w-full"><Link href="/rewards"><Sparkles size={16} />{gameShellT(state.locale, "Rewards & Shop")}</Link></Button>
            </CardContent>
          </Card>
          <CloudAccountPanel />
        </div>

        <div className="grid gap-4">
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><PackageOpen size={18} className="text-primary" />{gameShellT(state.locale, "Inventory")}</CardTitle></CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-2">
              {unlockedItems.length ? unlockedItems.map((item) => (
                <InventoryCard
                  key={item.id}
                  item={item}
                  locale={state.locale}
                  equipped={state.equippedBadgeId === item.id || state.equippedFrameId === item.id || state.equippedTitleId === item.id}
                  onEquip={() => state.equipInventoryItem(item.id)}
                  onUnequip={() => state.unequipInventoryType(item.type)}
                />
              )) : <p className="text-sm leading-6 text-muted-foreground">{gameShellT(state.locale, "Complete missions and achievements to earn profile items.")}</p>}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><GitBranch size={18} className="text-primary" />{translate(state.locale, "Unlocked Technologies")}</CardTitle></CardHeader>
            <CardContent><p className="text-3xl font-black">{state.completedTechnologyIds.length}</p></CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Languages size={18} className="text-primary" />{translate(state.locale, "Language")}</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {locales.map((locale) => (
                <Button key={locale.id} variant={state.locale === locale.id ? "default" : "outline"} size="sm" onClick={() => state.setLocale(locale.id as Locale)}>
                  {localeLabels[locale.id]}
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
