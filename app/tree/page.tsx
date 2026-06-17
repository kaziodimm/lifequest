"use client";

import { AppShell } from "@/components/app-shell";
import { LifeTree } from "@/components/life-tree";
import styles from "./tree-visuals.module.css";

export default function TreePage() {
  return (
    <AppShell immersive>
      <div className={styles.visualTreeSkin}>
        <LifeTree />
      </div>
    </AppShell>
  );
}
