"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AppShell } from "@/components/app-shell";
import { LifeTree } from "@/components/life-tree";
import { TreeCameraController } from "@/components/tree-camera-controller";
import { defaultTreeThemeId, treeThemes, type TreeThemeId } from "@/lib/tree-themes";
import { applySiteTheme, readSiteTheme } from "@/lib/site-theme";
import fieldStyles from "./tree-field.module.css";
import styles from "./tree-visuals.module.css";
import assetStyles from "./tree-generated-assets.module.css";

export default function TreePage() {
  const [themeId, setThemeId] = useState<TreeThemeId>(defaultTreeThemeId);

  useEffect(() => {
    const savedTheme = readSiteTheme();
    setThemeId(savedTheme);
    applySiteTheme(savedTheme, false);
  }, []);

  function selectTheme(nextThemeId: TreeThemeId) {
    setThemeId(nextThemeId);
    applySiteTheme(nextThemeId);
  }

  return (
    <AppShell immersive>
      <div className={`${fieldStyles.fullscreenField} ${styles.visualTreeSkin} ${assetStyles.generatedTreeAssets}`} data-tree-theme={themeId}>
        <TreeCameraController className={fieldStyles.cameraDock} />
        <div className={fieldStyles.themeDock} aria-label="Choose interface theme">
          <div className={fieldStyles.themeSwatches}>
            {treeThemes.map((theme) => (
              <button
                key={theme.id}
                type="button"
                className={theme.id === themeId ? fieldStyles.themeSwatchActive : fieldStyles.themeSwatch}
                style={{
                  ["--theme-primary" as string]: theme.palette.primary,
                  ["--theme-secondary" as string]: theme.palette.secondary,
                  ["--theme-accent" as string]: theme.palette.accent
                }}
                aria-label={`Use ${theme.title} theme`}
                aria-pressed={theme.id === themeId}
                onClick={() => selectTheme(theme.id)}
              >
                <Image src={`/art/themes-v4/${theme.id}/emblem-base.webp`} alt="" width={42} height={42} />
                <small className={fieldStyles.themeName}>{theme.shortTitle}</small>
              </button>
            ))}
          </div>
        </div>
        <LifeTree />
      </div>
    </AppShell>
  );
}
