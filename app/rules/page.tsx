import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const rules = [
  "Use Habidoo for real personal progress, not manipulation, harassment or impersonation.",
  "Choose a Habid that is not offensive, misleading, reserved or pretending to be official staff.",
  "Do not upload or enter illegal, hateful, exploitative or intentionally harmful content.",
  "Do not try to access another user’s account, progress state or private data.",
  "Do not use automation or abuse patterns that degrade the service for others.",
  "Treat missions as guidance. For health, money, legal or safety decisions, use qualified professional help."
];

export default function RulesPage() {
  return (
    <AppShell hideNavigation>
      <main className="mx-auto grid max-w-3xl gap-4 py-6">
        <Link href="/" className="text-sm font-bold text-primary hover:underline">← Back to Habidoo</Link>
        <Card>
          <CardHeader>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-primary">Habidoo community</p>
            <CardTitle className="text-3xl">Rules of Use</CardTitle>
            <p className="text-sm text-muted-foreground">Simple rules for a product about real-life progress.</p>
          </CardHeader>
          <CardContent className="grid gap-3">
            {rules.map((rule, index) => (
              <div key={rule} className="flex gap-3 rounded-xl border border-border bg-muted/25 p-4">
                <span className="grid size-7 shrink-0 place-items-center rounded-full bg-primary/15 text-xs font-black text-primary">{index + 1}</span>
                <p className="text-sm leading-6 text-muted-foreground">{rule}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </main>
    </AppShell>
  );
}
