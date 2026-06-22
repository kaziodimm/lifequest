"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { LockKeyhole } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { LifeTree } from "@/components/life-tree";
import { TreeCameraController } from "@/components/tree-camera-controller";
import { defaultTreeThemeId, treeThemes, type TreeThemeId } from "@/lib/tree-themes";
import { applySiteTheme, readSiteTheme } from "@/lib/site-theme";
import { useLifeStore } from "@/lib/store";
import fieldStyles from "./tree-field.module.css";
import styles from "./tree-visuals.module.css";
import assetStyles from "./tree-generated-assets.module.css";

export default function TreePage() {
  const [themeId, setThemeId] = useState<TreeThemeId>(defaultTreeThemeId);
  const [initialTechnologyId, setInitialTechnologyId] = useState<string | null>(null);
  const unlockedThemeIds = useLifeStore((state) => state.unlockedTreeThemeIds);

  useEffect(() => {
    setInitialTechnologyId(new URLSearchParams(window.location.search).get("focus"));
    const savedTheme = readSiteTheme();
    setThemeId(savedTheme);
    applySiteTheme(savedTheme, false);
  }, []);

  function selectTheme(nextThemeId: TreeThemeId) {
    setThemeId(nextThemeId);
    applySiteTheme(nextThemeId, unlockedThemeIds.includes(nextThemeId));
  }

  return (
    <AppShell immersive>
      <div className={`${fieldStyles.fullscreenField} ${styles.visualTreeSkin} ${assetStyles.generatedTreeAssets}`} data-tree-theme={themeId}>
        <TreeCameraController className={fieldStyles.cameraDock} />
        <div className={fieldStyles.themeDock} aria-label="Choose interface theme">
          <div className={fieldStyles.themeSwatches}>
            {treeThemes.map((theme) => {
              const unlocked = unlockedThemeIds.includes(theme.id);
              return (
              <button
                key={theme.id}
                type="button"
                className={`${theme.id === themeId ? fieldStyles.themeSwatchActive : fieldStyles.themeSwatch} ${unlocked ? "" : fieldStyles.themeSwatchLocked}`}
                style={{
                  ["--theme-primary" as string]: theme.palette.primary,
                  ["--theme-secondary" as string]: theme.palette.secondary,
                  ["--theme-accent" as string]: theme.palette.accent
                }}
                aria-label={`${unlocked ? "Use" : "Preview locked"} ${theme.title} theme`}
                aria-pressed={theme.id === themeId}
                data-theme-locked={!unlocked || undefined}
                onClick={() => selectTheme(theme.id)}
              >
                <Image src={`/art/themes-v4/${theme.id}/emblem-base.webp`} alt="" width={42} height={42} />
                {!unlocked ? <LockKeyhole className={fieldStyles.themeLock} size={12} aria-hidden="true" /> : null}
                <small className={fieldStyles.themeName}>{theme.shortTitle}</small>
              </button>
              );
            })}
          </div>
        </div>
        <LifeTree initialTechnologyId={initialTechnologyId} />
      </div>
    </AppShell>
  );
}
