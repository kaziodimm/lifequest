import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const sections = [
  ["Use of Habidoo", "Habidoo helps you plan and track self-improvement missions. You are responsible for your own choices, actions and safety."],
  ["Account", "You must use your own email account, keep access secure and choose a Habid that follows the public username rules."],
  ["Progress data", "Your progress, missions, focus objects and statistics may be saved to your account when you are logged in and sync is active."],
  ["No professional advice", "Habidoo is not medical, legal, financial or mental-health advice. If a decision is high-risk, consult a qualified professional."],
  ["Fair use", "Do not abuse, attack, scrape, reverse engineer, spam, impersonate others or attempt to access data that is not yours."],
  ["Changes", "Habidoo is in active development. Features, rules and progression systems may change as the product improves."]
];

export default function TermsPage() {
  return (
    <AppShell hideNavigation>
      <main className="mx-auto grid max-w-3xl gap-4 py-6">
        <Link href="/" className="text-sm font-bold text-primary hover:underline">← Back to Habidoo</Link>
        <Card>
          <CardHeader>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-primary">Habidoo legal</p>
            <CardTitle className="text-3xl">Terms of Use</CardTitle>
            <p className="text-sm text-muted-foreground">Effective date: June 23, 2026. This is an MVP policy and should be reviewed before public scale.</p>
          </CardHeader>
          <CardContent className="grid gap-4">
            {sections.map(([title, body]) => (
              <section key={title} className="rounded-xl border border-border bg-muted/25 p-4">
                <h2 className="font-black text-foreground">{title}</h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{body}</p>
              </section>
            ))}
          </CardContent>
        </Card>
      </main>
    </AppShell>
  );
}
