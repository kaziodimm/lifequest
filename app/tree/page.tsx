import { AppShell } from "@/components/app-shell";
import { LifeTree } from "@/components/life-tree";

export default function TreePage() {
  return (
    <AppShell>
      <div className="mb-4">
        <p className="mb-2 text-xs font-bold uppercase tracking-wide text-primary">Core System</p>
        <h1 className="text-2xl font-black text-foreground">Life Technology Tree</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">Research real-life technologies by completing missions. Locked nodes show future potential, glowing nodes show unlocked progress.</p>
      </div>
      <LifeTree />
    </AppShell>
  );
}
