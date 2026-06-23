import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.habidoo.com"),
  title: "Habidoo | Life Strategy",
  description: "A closed-beta Life Strategy RPG for guided missions, evidence-based progress, achievements and a living Life Tree.",
  manifest: "/manifest.json",
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg"
  },
  openGraph: {
    title: "Habidoo | Life Strategy",
    description: "Guided missions, Focus Objects, achievements and profile identity for real-life progress.",
    images: ["/art/landing/habidoo-life-system-hero.png"]
  }
};

export const viewport: Viewport = {
  themeColor: "#080A12",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark" data-site-theme="orbit">
      <body>{children}</body>
    </html>
  );
}
