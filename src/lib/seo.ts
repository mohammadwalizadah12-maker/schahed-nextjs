import type { Metadata } from "next";
import { t, type Locale } from "@/lib/i18n";
import { SITE_NAME_FULL, SITE_URL } from "@/lib/site-config";

/** Seiten mit eigenen Titeln/Beschreibungen in i18n.ts (Schluessel `seo.<page>.*`). */
export type SeoPage =
  | "home"
  | "about"
  | "projects"
  | "donate"
  | "contact"
  | "news"
  | "links"
  | "membership"
  | "feedback";

export const OG_IMAGE_PATH = "/og-bild.png";

/**
 * Baut die Metadata einer Unterseite: Titel und Beschreibung aus i18n,
 * Canonical + hreflang, Open Graph und Twitter-Card mit dem Vereinsbild.
 *
 * `path` ist der Pfad ohne Sprachpraefix ("" fuer die Startseite, sonst z. B. "about").
 * Die Startseite bekommt einen absoluten Titel, weil er den Vereinsnamen schon
 * enthaelt und das Layout-Template (" | Schahed") sonst doppelt.
 */
export function pageMetadata(locale: Locale, page: SeoPage, path: string = page === "home" ? "" : page): Metadata {
  const title = t(locale, `seo.${page}.title`);
  const description = t(locale, `seo.${page}.description`);
  const suffix = path ? `/${path}` : "";
  const url = `${SITE_URL}/${locale}${suffix}`;
  const images = [{ url: OG_IMAGE_PATH, width: 1200, height: 630, alt: t(locale, "seo.ogAlt") }];

  return {
    title: page === "home" ? { absolute: title } : title,
    description,
    alternates: {
      canonical: url,
      languages: {
        de: `${SITE_URL}/de${suffix}`,
        fa: `${SITE_URL}/fa${suffix}`,
        "x-default": `${SITE_URL}/de${suffix}`,
      },
    },
    openGraph: {
      type: "website",
      locale: locale === "fa" ? "fa_AF" : "de_DE",
      url,
      siteName: SITE_NAME_FULL,
      title,
      description,
      images,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [OG_IMAGE_PATH],
    },
  };
}
