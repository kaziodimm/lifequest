"use client";

import { AppShell } from "@/components/app-shell";
import { LifeTree } from "@/components/life-tree";

export default function TreePage() {
  return (
    <AppShell immersive>
      <LifeTree />
    </AppShell>
  );
}
