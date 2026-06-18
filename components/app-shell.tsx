"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { GitBranch } from "lucide-react";
import { cn } from "@/lib/utils";
import { defaultTreeThemeId, type TreeThemeId } from "@/lib/tree-themes";
import { applySiteTheme, readSiteTheme, siteThemeEvent } from "@/lib/site-theme";

const nav = [
  { href: "/tree", label: "Tree", asset: "nav-tree" },
  { href: "/command", label: "Missions", asset: "nav-missions" },
  { href: "/stats", label: "Stats", asset: "nav-stats" },
  { href: "/achievements", label: "Awards", asset: "nav-awards" },
  { href: "/profile", label: "Profile", asset: "nav-profile" }
];

export function AppShell({ children, immersive = false }: { children: React.ReactNode; immersive?: boolean }) {
  const pathname = usePathname();
  const [themeId, setThemeId] = useState<TreeThemeId>(defaultTreeThemeId);

  useEffect(() => {
    const saved = readSiteTheme();
    setThemeId(saved);
    applySiteTheme(saved, false);
    const handleTheme = (event: Event) => setThemeId((event as CustomEvent<TreeThemeId>).detail);
    window.addEventListener(siteThemeEvent, handleTheme);
    return () => window.removeEventListener(siteThemeEvent, handleTheme);
  }, []);

  return (
    <main className={cn("app-theme-shell min-h-screen", immersive ? "overflow-hidden pb-0" : "pb-24")} data-site-theme={themeId}>
      {immersive ? (
        children
      ) : (
        <div className="mx-auto w-full max-w-6xl px-4 py-4 sm:px-6 lg:px-8">
          <header className="app-header mb-5 flex items-center justify-between border border-border px-4 py-3">
            <Link href="/" className="flex items-center gap-3">
              <div className="app-brand-mark grid size-10 place-items-center bg-primary text-primary-foreground shadow-node">
                <GitBranch size={20} />
              </div>
              <div>
                <p className="text-sm font-black uppercase tracking-wide text-foreground">Habidoo</p>
                <p className="text-xs text-muted-foreground">Life Strategy</p>
              </div>
            </Link>
            <div className="app-era-badge border border-border px-3 py-1 text-xs font-semibold text-muted-foreground">Foundation Era</div>
          </header>
          {children}
        </div>
      )}
      <nav className="app-bottom-nav fixed inset-x-0 bottom-0 z-[90] grid grid-cols-5 border-t border-border px-2 py-2 md:left-1/2 md:max-w-xl md:-translate-x-1/2 md:border-x">
        {nav.map((item) => {
          const active = pathname === item.href;
          return (
            <Link key={item.href} href={item.href} className={cn("app-nav-link flex flex-col items-center gap-1 px-1 py-1 text-[11px] font-semibold transition", active && "is-active")}>
              <img className="app-nav-emblem" src={`/art/themes-v3/${themeId}/${item.asset}.webp`} alt="" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </main>
  );
}
