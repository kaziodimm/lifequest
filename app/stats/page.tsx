"use client";

import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { AppShell } from "@/components/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLifeStore } from "@/lib/store";

export default function StatsPage() {
  const history = useLifeStore((state) => state.progressHistory);
  const completed = useLifeStore((state) => state.completedTechnologyIds.length);
  const data = history.map((value, index) => ({ day: `D${index + 1}`, progress: value }));

  return (
    <AppShell>
      <div className="mb-4">
        <p className="mb-2 text-xs font-bold uppercase tracking-wide text-primary">Intelligence</p>
        <h1 className="text-2xl font-black text-foreground">Statistics</h1>
        <p className="mt-2 text-sm text-muted-foreground">Progress history should show life development, not only task completion.</p>
      </div>

      <section className="grid gap-4 lg:grid-cols-[1fr_0.7fr]">
        <Card>
          <CardHeader><CardTitle>7 Day Progress</CardTitle></CardHeader>
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
          <CardHeader><CardTitle>Category Growth</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>Unlocked technologies: <span className="font-bold text-foreground">{completed}</span></p>
            <p>Prepared for future category analytics: Health, Mind, Career, Business, Finance, Relationships, Creativity.</p>
            <p>Future: streak history, XP growth, category balance, and strategic recommendations.</p>
          </CardContent>
        </Card>
      </section>
    </AppShell>
  );
}
