"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useI18n, useLocale } from "@/components/I18nProvider";
import { NAV_ITEMS, DONATE_PATH } from "@/lib/nav";
import Logo from "@/components/Logo";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export default function SiteNav() {
  const { t } = useI18n();
  const locale = useLocale();
  const pathname = usePathname() || "";
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Mobiles Menue bei Navigation schliessen
  useEffect(() => setOpen(false), [pathname]);

  /**
   * Offenes Menue: mit Escape schliessbar und Seite dahinter nicht scrollbar.
   * Ohne Scroll-Sperre scrollt der Hintergrund unter dem Menue weg.
   */
  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);

    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  const href = (path: string) => `/${locale}${path}`;
  const isActive = (path: string) => {
    const full = href(path);
    return path === "" ? pathname === full : pathname.startsWith(full);
  };

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-colors ${
        scrolled
          ? "border-sand-200 bg-white/90 backdrop-blur"
          : "border-transparent bg-white/60 backdrop-blur-sm"
      }`}
    >
      <nav className="mx-auto flex h-20 w-full max-w-[1320px] items-center justify-between gap-2 px-5 xl:h-28">
        <Link href={href("")} aria-label="Schahed" className="flex shrink-0 items-center">
          {/* Emblem bewusst gross: das Logo ist das Erkennungsmerkmal des
              Vereins und soll den Header ausfuellen (Wunsch Mohammad). */}
          {/* Schriftzug erst ab 380 px: darunter braeuchten Logo, Sprach-
              umschalter und Menue-Knopf zusammen mehr Platz als vorhanden. */}
          <Logo
            emblemSize={100}
            emblemClass="h-14 w-14 xl:h-24 xl:w-24"
            wordmarkClass="hidden min-[380px]:flex"
          />
        </Link>

        {/* Desktop-Navigation */}
        <ul className="hidden items-center gap-1 xl:flex">
          {NAV_ITEMS.map((item) => (
            <li key={item.key}>
              <Link
                href={href(item.path)}
                className={`whitespace-nowrap rounded-full px-2.5 py-2 text-sm font-medium transition ${
                  isActive(item.path)
                    ? "bg-brand-50 text-brand-800"
                    : "text-brand-700 hover:bg-sand-100 hover:text-brand-800"
                }`}
              >
                {t(item.key)}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden shrink-0 items-center gap-2 xl:flex">
          <LanguageSwitcher />
          <Link
            href={href(DONATE_PATH)}
            // accent-500 + Weiss statt accent-400 + brand-900:
            // 6,3:1 Kontrast statt 2,4:1 (WCAG AA), auch im Hover-Zustand.
            className="shrink-0 whitespace-nowrap rounded-full bg-accent-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-accent-600"
          >
            {t("nav.donateCta")}
          </Link>
        </div>

        {/*
          Mobile Kopfzeile: Sprachumschalter steht NEBEN dem Menue-Knopf und
          nicht mehr nur im aufgeklappten Menue. Die Sprachwahl ist damit auf
          der Startseite sofort sichtbar, ohne das Burger-Menue zu oeffnen.
        */}
        <div className="flex shrink-0 items-center gap-1 xl:hidden">
          <LanguageSwitcher compact />

          {/* Mobiler Toggle */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
            aria-expanded={open}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-brand-800 hover:bg-sand-100"
          >
            <span className="relative block h-4 w-5">
              <span
                className={`absolute left-0 top-0 h-0.5 w-5 bg-current transition ${open ? "translate-y-[7px] rotate-45" : ""}`}
              />
              <span
                className={`absolute left-0 top-[7px] h-0.5 w-5 bg-current transition ${open ? "opacity-0" : ""}`}
              />
              <span
                className={`absolute left-0 top-[14px] h-0.5 w-5 bg-current transition ${open ? "-translate-y-[7px] -rotate-45" : ""}`}
              />
            </span>
          </button>
        </div>
      </nav>

      {/* Mobiles Drawer */}
      {open && (
        // max-h + overflow-y: 8 Menuepunkte passen im Querformat sonst nicht
        // auf den Schirm und die unteren Eintraege sind unerreichbar.
        <div className="max-h-[calc(100svh-5rem)] overflow-y-auto overscroll-contain border-t border-sand-200 bg-white xl:hidden">
          <ul className="mx-auto max-w-[1180px] px-5 py-3">
            {NAV_ITEMS.map((item, i) => (
              <li key={item.key} className="reveal" style={{ animationDelay: `${i * 40}ms` }}>
                <Link
                  href={href(item.path)}
                  className={`block rounded-lg px-3 py-3 text-base font-medium ${
                    isActive(item.path) ? "bg-brand-50 text-brand-800" : "text-brand-700"
                  }`}
                >
                  {t(item.key)}
                </Link>
              </li>
            ))}
          </ul>
          {/* Sprachumschalter steht jetzt dauerhaft in der Kopfzeile,
              hier bleibt nur der Spenden-Aufruf. */}
          <div className="mx-auto flex max-w-[1180px] px-5 pb-5">
            <Link
              href={href(DONATE_PATH)}
              className="w-full rounded-full bg-accent-500 px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-accent-600"
            >
              {t("nav.donateCta")}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
