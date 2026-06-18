"use client";

import { AppShell } from "@/components/app-shell";
import { LifeTree } from "@/components/life-tree";
import { defaultTreeThemeId } from "@/lib/tree-themes";
import styles from "./tree-visuals.module.css";

export default function TreePage() {
  return (
    <AppShell immersive>
      <div className={styles.visualTreeSkin} data-tree-theme={defaultTreeThemeId}>
        <LifeTree />
      </div>
    </AppShell>
  );
}
