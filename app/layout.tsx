import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Habidoo | Life Strategy",
  description: "Turn real life into a strategy game with a Life Technology Tree."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark">
      <body>{children}</body>
    </html>
  );
}
