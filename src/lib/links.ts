/**
 * Nützliche Links (لینکهای مفید).
 *
 * Datenquelle: data/links.json (kanonisch, über das CMS unter /admin/links
 * editierbar, gespeichert per GitHub-API -> Vercel-Redeploy).
 *
 * Optional:
 *   heading  Rubrik/Überschrift, unter der der Link gruppiert wird.
 *   image    Vorschaubild (Pfad oder URL). Leer -> automatische Vorschau
 *            (og:image der Zielseite, sonst Favicon).
 */
import linksData from "@/../data/links.json";

export interface UsefulLink {
  id: string;
  url: string;
  heading?: { de: string; fa: string };
  image?: string;
  title: { de: string; fa: string };
  description: { de: string; fa: string };
}

export const LINKS: UsefulLink[] = linksData as UsefulLink[];

export function allLinks(): UsefulLink[] {
  return LINKS;
}
