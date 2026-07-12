"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LOCALES, LOCALE_LABELS, isLocale, type Locale } from "@/lib/i18n";
import { useLocale } from "@/components/I18nProvider";

/**
 * Wechselt die Sprache und BEHAELT den aktuellen Pfad bei
 * (z. B. /de/projects <-> /fa/projects).
 */
export default function LanguageSwitcher({
  onNavigate,
}: {
  onNavigate?: () => void;
}) {
  const current = useLocale();
  const pathname = usePathname() || `/${current}`;

  const swapLocale = (target: Locale) => {
    const parts = pathname.split("/");
    // parts[0] = "" , parts[1] = locale
    if (isLocale(parts[1])) parts[1] = target;
    else return `/${target}`;
    return parts.join("/") || `/${target}`;
  };

  return (
    <div className="flex items-center gap-1 rounded-full bg-sand-100 p-1">
      {LOCALES.map((l) => {
        const active = l === current;
        return (
          <Link
            key={l}
            href={swapLocale(l)}
            onClick={onNavigate}
            hrefLang={l}
            aria-current={active ? "true" : undefined}
            className={`rounded-full px-3 py-1 text-sm font-medium transition ${
              active
                ? "bg-white text-brand-800 shadow-sm"
                : "text-brand-600/70 hover:text-brand-800"
            }`}
          >
            {LOCALE_LABELS[l]}
          </Link>
        );
      })}
    </div>
  );
}
