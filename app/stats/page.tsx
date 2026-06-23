"use client";

import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { AppShell } from "@/components/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { categoryProgress } from "@/lib/insights";
import { categoryColors } from "@/lib/life-tree";
import { useLifeStore } from "@/lib/store";
import { translate } from "@/lib/i18n";

export default function StatsPage() {
  const state = useLifeStore();
  const now = Date.now();
  const data = Array.from({ length: 7 }, (_, index) => {
    const start = now - (6 - index) * 24 * 60 * 60 * 1000;
    const end = start + 24 * 60 * 60 * 1000;
    return { day: `D${index + 1}`, progress: state.missionAttempts.filter((attempt) => attempt.completedAt && attempt.completedAt >= start && attempt.completedAt < end).length };
  });
  const categories = categoryProgress(state);

  return (
    <AppShell>
      <div className="mb-4">
        <p className="mb-2 text-xs font-bold uppercase tracking-wide text-primary">{translate(state.locale, "Intelligence")}</p>
        <h1 className="text-2xl font-black text-foreground">{translate(state.locale, "Statistics")}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{translate(state.locale, "Progress history should show life development, not only task completion.")}</p>
      </div>

      <section className="grid gap-4 lg:grid-cols-[1fr_0.7fr]">
        <Card>
          <CardHeader><CardTitle>{translate(state.locale, "7 Day Progress")}</CardTitle></CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="progress" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4ce0d2" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#4ce0d2" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip contentStyle={{ background: "#111827", border: "1px solid #334155", borderRadius: 8 }} />
                <Area type="monotone" dataKey="progress" stroke="#4ce0d2" fillOpacity={1} fill="url(#progress)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>{translate(state.locale, "Category Growth")}</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {categories.map((item) => (
              <div key={item.category}>
                <div className="mb-1 flex justify-between text-xs">
                  <span className="font-bold" style={{ color: categoryColors[item.category as keyof typeof categoryColors] }}>{translate(state.locale, item.label)}</span>
                  <span className="text-muted-foreground">{item.percent}%</span>
                </div>
                <Progress value={item.percent} />
                <p className="mt-1 text-[11px] text-muted-foreground">{item.unlocked} {translate(state.locale, "of")} {item.total} {translate(state.locale, "technologies unlocked")}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </AppShell>
  );
}
