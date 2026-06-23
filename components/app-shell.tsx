"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Award, BarChart3, GitBranch, Radar, UserRound } from "lucide-react";
import { cn } from "@/lib/utils";
import { defaultTreeThemeId, type TreeThemeId } from "@/lib/tree-themes";
import { applySiteTheme, readSiteTheme, siteThemeEvent } from "@/lib/site-theme";
import { translate } from "@/lib/i18n";
import { useLifeStore } from "@/lib/store";
import { useAuthState } from "@/lib/auth-state";

const nav = [
  { href: "/tree", label: "Tree", icon: GitBranch },
  { href: "/command", label: "Missions", icon: Radar },
  { href: "/stats", label: "Stats", icon: BarChart3 },
  { href: "/achievements", label: "Awards", icon: Award },
  { href: "/profile", label: "Profile", icon: UserRound }
];

export function AppShell({ children, immersive = false, hideNavigation = false }: { children: React.ReactNode; immersive?: boolean; hideNavigation?: boolean }) {
  const pathname = usePathname();
  const router = useRouter();
  const locale = useLifeStore((state) => state.locale);
  const onboardingCompleted = useLifeStore((state) => state.onboardingCompleted);
  const [themeId, setThemeId] = useState<TreeThemeId>(defaultTreeThemeId);
  const [hydrated, setHydrated] = useState(false);
  const auth = useAuthState();

  useEffect(() => {
    const saved = readSiteTheme();
    setThemeId(saved);
    applySiteTheme(saved, false);
    const handleTheme = (event: Event) => setThemeId((event as CustomEvent<TreeThemeId>).detail);
    window.addEventListener(siteThemeEvent, handleTheme);
    return () => window.removeEventListener(siteThemeEvent, handleTheme);
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  useEffect(() => {
    setHydrated(useLifeStore.persist.hasHydrated());
    return useLifeStore.persist.onFinishHydration(() => setHydrated(true));
  }, []);

  const protectedRoute = ["/tree", "/command", "/stats", "/profile", "/achievements"].includes(pathname);
  const toolRoute = ["/tree", "/command", "/stats", "/achievements"].includes(pathname);

  useEffect(() => {
    if (!hydrated || !protectedRoute || auth.status === "loading" || !auth.profileLoaded) return;
    if (auth.status !== "authenticated") {
      router.replace("/");
      return;
    }
    if (toolRoute && !auth.hasProfile) {
      router.replace("/profile");
      return;
    }
    if (toolRoute && !onboardingCompleted) router.replace("/");
  }, [auth.hasProfile, auth.profileLoaded, auth.status, hydrated, onboardingCompleted, protectedRoute, router, toolRoute]);

  if (protectedRoute && (!hydrated || auth.status === "loading" || !auth.profileLoaded || auth.status !== "authenticated" || (toolRoute && (!auth.hasProfile || !onboardingCompleted)))) {
    return <main className="app-theme-shell grid min-h-screen place-items-center p-6 text-sm font-bold text-muted-foreground" data-site-theme={themeId}>{translate(locale, "Preparing Habidoo...")}</main>;
  }

  return (
    <main className={cn("app-theme-shell min-h-screen", immersive || hideNavigation ? "overflow-hidden pb-0" : "pb-24")} data-site-theme={themeId}>
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
                <p className="text-xs text-muted-foreground">{translate(locale, "Life Strategy")}</p>
              </div>
            </Link>
            <div className="app-era-badge border border-border px-3 py-1 text-xs font-semibold text-muted-foreground">{translate(locale, "Foundation Era")}</div>
          </header>
          {children}
        </div>
      )}
      {!hideNavigation ? <nav className="app-bottom-nav fixed inset-x-0 bottom-0 z-[90] grid grid-cols-5 border-t border-border px-2 py-2 md:left-1/2 md:max-w-xl md:-translate-x-1/2 md:border-x">
        {nav.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <Link key={item.href} href={item.href} className={cn("app-nav-link flex flex-col items-center gap-1 px-1 py-1 text-[11px] font-semibold transition", active && "is-active")}>
              <span className="app-nav-emblem" aria-hidden="true">
                <Image src={`/art/themes-v4/${themeId}/emblem-base.webp`} alt="" width={38} height={38} />
                <Icon size={17} />
              </span>
              {translate(locale, item.label)}
            </Link>
          );
        })}
      </nav> : null}
    </main>
  );
}
