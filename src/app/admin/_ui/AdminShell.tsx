"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "@/components/Logo";

/**
 * Rahmen fuer alle Redaktionsseiten: Seitenleiste (Desktop) bzw. Tab-Leiste
 * (Telefon) mit den drei Bereichen, Abmelden und Link zur Live-Seite.
 */
const NAV = [
  { href: "/admin", label: "Beiträge", hint: "Aktuelles und Artikel", icon: "M4 6h16M4 12h16M4 18h10" },
  { href: "/admin/links", label: "Nützliche Links", hint: "Partner und Empfehlungen", icon: "M10 14a5 5 0 007 0l3-3a5 5 0 00-7-7l-1 1M14 10a5 5 0 00-7 0l-3 3a5 5 0 007 7l1-1" },
  { href: "/admin/texte", label: "Website-Texte", hint: "Alle Oberflächentexte DE/FA", icon: "M4 6h16M4 10h16M4 14h10M4 18h6" },
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const isActive = (href: string) => (href === "/admin" ? path === "/admin" : path.startsWith(href));

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/admin/login";
  }

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[250px_1fr]">
      {/* Seitenleiste */}
      <aside className="border-b border-sand-200 bg-white lg:sticky lg:top-0 lg:h-screen lg:border-b-0 lg:border-e">
        <div className="flex items-center justify-between px-4 py-3 lg:block lg:px-5 lg:py-6">
          <Link href="/admin" className="flex items-center gap-2.5">
            <Logo showFa={false} emblemSize={38} />
          </Link>
          <span className="rounded-full bg-sand-100 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-brand-700 lg:mt-3 lg:inline-block">
            Redaktion
          </span>
        </div>

        <nav className="flex gap-1 overflow-x-auto px-3 pb-3 lg:flex-col lg:px-3 lg:pb-0" aria-label="Bereiche">
          {NAV.map((n) => {
            const active = isActive(n.href);
            return (
              <Link
                key={n.href}
                href={n.href}
                aria-current={active ? "page" : undefined}
                className={`flex shrink-0 items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${
                  active ? "bg-brand-100 font-semibold text-brand-900" : "text-brand-700 hover:bg-sand-100"
                }`}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d={n.icon} />
                </svg>
                <span>
                  <span className="block leading-tight">{n.label}</span>
                  <span className="hidden text-[11px] font-normal text-brand-700/80 lg:block">{n.hint}</span>
                </span>
              </Link>
            );
          })}
        </nav>

        <div className="hidden lg:absolute lg:inset-x-0 lg:bottom-0 lg:block lg:border-t lg:border-sand-200 lg:p-3">
          <a href="/de" target="_blank" rel="noopener" className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-brand-700 hover:bg-sand-100">
            Website ansehen <span aria-hidden>↗</span>
          </a>
          <button onClick={logout} className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-start text-sm text-brand-700 hover:bg-sand-100">
            Abmelden
          </button>
        </div>
      </aside>

      {/* Inh@LT */}
      <div className="min-w-0">
        <div className="flex items-center justify-end gap-1 px-4 pt-3 lg:hidden">
          <a href="/de" target="_blank" rel="noopener" className="rounded-full px-3 py-1.5 text-xs text-brand-700 hover:bg-sand-100">Website ↗</a>
          <button onClick={logout} className="rounded-full px-3 py-1.5 text-xs text-brand-700 hover:bg-sand-100">Abmelden</button>
        </div>
        {children}
      </div>
    </div>
  );
}
