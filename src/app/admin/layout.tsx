import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Admin · Schahed",
  robots: { index: false, follow: false },
};

/** Eigenes Root-Layout fuer den Admin-Bereich (LTR, keine oeffentliche Nav). */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" dir="ltr" className={inter.variable} suppressHydrationWarning>
      <body className="min-h-screen bg-sand-50 font-sans text-brand-900 antialiased">
        {children}
      </body>
    </html>
  );
}
