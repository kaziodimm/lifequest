"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Award, BarChart3, GitBranch, Radar, UserRound } from "lucide-react";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/tree", label: "Tree", icon: GitBranch },
  { href: "/command", label: "Missions", icon: Radar },
  { href: "/stats", label: "Stats", icon: BarChart3 },
  { href: "/achievements", label: "Awards", icon: Award },
  { href: "/profile", label: "Profile", icon: UserRound }
];

export function AppShell({ children, immersive = false }: { children: React.ReactNode; immersive?: boolean }) {
  const pathname = usePathname();

  return (
    <main className={cn("min-h-screen", immersive ? "overflow-hidden pb-0" : "pb-24")}>
      {immersive ? (
        children
      ) : (
        <div className="mx-auto w-full max-w-6xl px-4 py-4 sm:px-6 lg:px-8">
          <header className="mb-5 flex items-center justify-between rounded-lg border border-border bg-card/60 px-4 py-3 backdrop-blur">
            <Link href="/" className="flex items-center gap-3">
              <div className="grid size-10 place-items-center rounded-md bg-primary text-primary-foreground shadow-node">
                <GitBranch size={20} />
              </div>
              <div>
                <p className="text-sm font-black uppercase tracking-wide text-foreground">Habidoo</p>
                <p className="text-xs text-muted-foreground">Life Strategy</p>
              </div>
            </Link>
            <div className="rounded-md border border-border bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground">Foundation Era</div>
          </header>
          {children}
        </div>
      )}
      <nav className="fixed inset-x-0 bottom-0 z-[90] grid grid-cols-5 border-t border-border bg-background/94 px-2 py-2 backdrop-blur md:left-1/2 md:max-w-xl md:-translate-x-1/2 md:rounded-t-lg md:border-x">
        {nav.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <Link key={item.href} href={item.href} className={cn("flex flex-col items-center gap-1 rounded-md px-1 py-2 text-[11px] font-semibold transition", active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground")}>
              <Icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </main>
  );
}
