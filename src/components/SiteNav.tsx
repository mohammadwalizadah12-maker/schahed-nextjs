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
      <nav className="mx-auto flex h-20 max-w-[1180px] items-center justify-between gap-4 px-5">
        <Link href={href("")} aria-label="Schahed" className="shrink-0">
          <Logo emblemSize={60} />
        </Link>

        {/* Desktop-Navigation */}
        <ul className="hidden items-center gap-1 lg:flex">
          {NAV_ITEMS.map((item) => (
            <li key={item.key}>
              <Link
                href={href(item.path)}
                className={`rounded-full px-3.5 py-2 text-sm font-medium transition ${
                  isActive(item.path)
                    ? "bg-brand-50 text-brand-800"
                    : "text-brand-700/80 hover:bg-sand-100 hover:text-brand-800"
                }`}
              >
                {t(item.key)}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-3 lg:flex">
          <LanguageSwitcher />
          <Link
            href={href(DONATE_PATH)}
            className="rounded-full bg-accent-400 px-5 py-2.5 text-sm font-semibold text-brand-900 shadow-sm transition hover:bg-accent-300"
          >
            {t("nav.donateCta")}
          </Link>
        </div>

        {/* Mobiler Toggle */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label="Menu"
          aria-expanded={open}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full text-brand-800 hover:bg-sand-100 lg:hidden"
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
      </nav>

      {/* Mobiles Drawer */}
      {open && (
        <div className="border-t border-sand-200 bg-white lg:hidden">
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
          <div className="mx-auto flex max-w-[1180px] items-center justify-between gap-3 px-5 pb-5">
            <LanguageSwitcher onNavigate={() => setOpen(false)} />
            <Link
              href={href(DONATE_PATH)}
              className="rounded-full bg-accent-400 px-5 py-2.5 text-sm font-semibold text-brand-900"
            >
              {t("nav.donateCta")}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
