import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const sections = [
  ["Data we collect", "Email address, Habid, optional display name, locale, account identifiers and Habidoo progress state such as missions, answers, focus objects, rewards and statistics."],
  ["Why we collect it", "To create your account, confirm email, save progress, restore progress across devices and improve the product."],
  ["Where it is stored", "Account and progress data are stored through Supabase. Confirmation emails are sent through the configured email provider."],
  ["What we do not do", "We do not use a service-role key in the browser, do not store authorization in user metadata and do not intentionally make your private progress public."],
  ["Your choices", "You can log out, reset local progress from Profile and request account/data deletion through support once the public support channel is finalized."],
  ["Safety note", "Do not enter highly sensitive medical, legal, financial or emergency information into mission answers."]
];

export default function PrivacyPage() {
  return (
    <AppShell hideNavigation>
      <main className="mx-auto grid max-w-3xl gap-4 py-6">
        <Link href="/" className="text-sm font-bold text-primary hover:underline">← Back to Habidoo</Link>
        <Card>
          <CardHeader>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-primary">Habidoo legal</p>
            <CardTitle className="text-3xl">Privacy Policy</CardTitle>
            <p className="text-sm text-muted-foreground">Effective date: June 23, 2026. This MVP policy describes the current account and progress-save model.</p>
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
