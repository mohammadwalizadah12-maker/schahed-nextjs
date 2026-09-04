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
  compact = false,
}: {
  onNavigate?: () => void;
  /**
   * Kompakte Variante fuer die mobile Kopfzeile: schmalere Polsterung, damit
   * der Umschalter neben Logo und Menue-Knopf Platz hat und nicht erst im
   * Burger-Menue auftaucht (Sprachwahl ist auf der Startseite sofort sichtbar).
   */
  compact?: boolean;
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
    <div
      className={`flex items-center rounded-full bg-sand-100 ${
        compact ? "gap-0.5 p-0.5" : "gap-1 p-1"
      }`}
    >
      {LOCALES.map((l) => {
        const active = l === current;
        return (
          <Link
            key={l}
            href={swapLocale(l)}
            onClick={onNavigate}
            hrefLang={l}
            aria-current={active ? "true" : undefined}
            // min-h-11 (bzw. 10 kompakt): ausreichend grosse Touch-Flaeche.
            // Inaktive Sprache mit text-brand-700 statt brand-600/70:
            // 5,7:1 Kontrast auf sand-100 statt 2,6:1 (WCAG AA).
            className={`inline-flex items-center rounded-full font-medium transition ${
              compact
                ? "min-h-10 px-3 py-1.5 text-[13px]"
                : "min-h-11 px-4 py-2 text-sm sm:min-h-0 sm:py-1"
            } ${
              active
                ? "bg-white text-brand-800 shadow-sm"
                : "text-brand-700 hover:text-brand-900"
            }`}
          >
            {LOCALE_LABELS[l]}
          </Link>
        );
      })}
    </div>
  );
}
