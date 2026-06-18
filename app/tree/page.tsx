"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { LifeTree } from "@/components/life-tree";
import { TreeCameraController } from "@/components/tree-camera-controller";
import { defaultTreeThemeId, treeThemes, type TreeThemeId } from "@/lib/tree-themes";
import fieldStyles from "./tree-field.module.css";
import styles from "./tree-visuals.module.css";

const themeStorageKey = "habidoo-tree-theme";

export default function TreePage() {
  const [themeId, setThemeId] = useState<TreeThemeId>(defaultTreeThemeId);

  useEffect(() => {
    const savedTheme = window.localStorage.getItem(themeStorageKey) as TreeThemeId | null;
    if (savedTheme && treeThemes.some((theme) => theme.id === savedTheme)) setThemeId(savedTheme);
  }, []);

  function selectTheme(nextThemeId: TreeThemeId) {
    setThemeId(nextThemeId);
    window.localStorage.setItem(themeStorageKey, nextThemeId);
  }

  return (
    <AppShell immersive>
      <div className={`${styles.visualTreeSkin} ${fieldStyles.fullscreenField}`} data-tree-theme={themeId}>
        <TreeCameraController className={fieldStyles.cameraDock} />
        <div className={fieldStyles.themeDock} aria-label="Visual themes">
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
              aria-label={`Switch to ${theme.title}`}
              title={theme.title}
              onClick={() => selectTheme(theme.id)}
            >
              <span />
            </button>
          ))}
        </div>
        <LifeTree />
      </div>
    </AppShell>
  );
}
