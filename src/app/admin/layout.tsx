import type { Metadata } from "next";
import { Inter, Vazirmatn } from "next/font/google";
import "../globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const vazir = Vazirmatn({ subsets: ["arabic"], variable: "--font-vazir", preload: false, display: "swap" });

export const metadata: Metadata = {
  title: { default: "Redaktion · Schahed", template: "%s · Redaktion Schahed" },
  robots: { index: false, follow: false },
};

/**
 * Eigenes Root-Layout fuer den Verwaltungsbereich (LTR, keine oeffentliche Nav).
 * Die eigentliche Shell mit Seitenleiste liegt in AdminShell (Client), damit
 * der aktive Bereich hervorgehoben werden kann.
 */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" dir="ltr" className={`${inter.variable} ${vazir.variable}`} suppressHydrationWarning>
      <body className="min-h-screen bg-sand-50 font-sans text-brand-900 antialiased">
        {children}
      </body>
    </html>
  );
}
